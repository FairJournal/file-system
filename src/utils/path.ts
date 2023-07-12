import { assertDirectories, Directory } from '../file-system/directory'
import { File } from '../file-system/file'
import { AddFileActionData, assertFileActionData } from '../file-system/update/interfaces/add-file-action'
import { AddDirectoryActionData } from '../file-system/update/interfaces/add-directory-action'
import { assertFile, assertFiles } from '../file-system/file'

/**
 * Max length of the path
 */
export const MAX_PATH_LENGTH = 1000
/**
 * Max length of the directory name
 */
export const MAX_DIRECTORY_NAME_LENGTH = 255

/**
 * Type of the item
 */
export enum ItemType {
  File = 'file',
  Directory = 'directory',
}

/**
 * Splits path to parts
 *
 * @param path absolute path
 */
export function getPathParts(path: string): string[] {
  if (path.length === 0) {
    throw new Error('Path is empty')
  }

  if (!path.startsWith('/')) {
    throw new Error('Incorrect path. Should start with "/"')
  }

  if (path === '/') {
    return ['/']
  }

  return ['/', ...splitPath(path).slice(1)]
}

/**
 * Split path
 */
export function splitPath(path: string): string[] {
  return path.split('/')
}

/**
 * Asserts that new path is correct and can be created
 *
 * @param root Root directory
 * @param userAddress Address of the user
 * @param newPath Path to the item
 * @param itemType Type of the item
 */
export function assertCanCreateItem(
  root: Directory,
  userAddress: string,
  newPath: string,
  itemType: ItemType,
): asserts newPath is string {
  if (!isValidPath(newPath)) {
    throw new Error('Invalid path')
  }

  const parts = getPathParts(newPath)

  if (parts.length <= 1) {
    throw new Error('Path should be absolute and contain at least one component')
  }

  const name = parts[parts.length - 1]

  if (!name) {
    throw new Error('Name of the directory is required')
  }

  if (!isValidaDirectoryName(name)) {
    throw new Error('Incorrect directory name')
  }

  const iterateParts = [userAddress, ...parts.slice(1, parts.length - 1)]
  let currentDirectory: Directory | null = null
  for (let i = 0; i < iterateParts.length; i++) {
    const findPart = iterateParts[i]

    if (!currentDirectory) {
      currentDirectory = root
    }

    assertDirectories(currentDirectory.directories)
    const found: Directory | undefined = currentDirectory.directories.find(item => item.name === findPart)

    if (found) {
      currentDirectory = found
    } else {
      throw new Error(`Parent directory not found: "${findPart}"`)
    }
  }

  if (!currentDirectory) {
    throw new Error('Parent level not found')
  }

  if (itemType === ItemType.Directory) {
    assertDirectories(currentDirectory.directories)

    if (currentDirectory.directories.find(item => item.name === name)) {
      throw new Error('Directory already exists')
    }
  } else if (itemType === ItemType.File) {
    assertFiles(currentDirectory.files)

    if (currentDirectory.files.find(item => item.name === name)) {
      throw new Error('File already exists')
    }
  } else {
    throw new Error('Unknown item type')
  }
}

/**
 * Checks if path is valid
 *
 * @param path Path to check
 */
export function isValidPath(path: string): boolean {
  if (path.length === 0 || path.length > MAX_PATH_LENGTH) {
    return false
  }

  // Check if path contains only alphanumeric characters and '/'
  const isValid = /^[a-zA-Z0-9-/]*$/.test(path)

  if (!isValid) {
    return false
  }

  // Check for consecutive '/'
  const hasConsecutiveSlashes = /\/\//.test(path)

  return !hasConsecutiveSlashes
}

/**
 * Checks if directory name is valid
 *
 * @param directoryName Directory name to check
 */
export function isValidaDirectoryName(directoryName: string): boolean {
  if (directoryName.length === 0 || directoryName.length > MAX_DIRECTORY_NAME_LENGTH) {
    return false
  }

  return /^[a-zA-Z0-9-]*$/.test(directoryName)
}

/**
 * Add item to the list
 *
 * @param root Root list of directories
 * @param userAddress Address of the user
 * @param updateId Update id
 * @param item Item to add
 * @param itemType Type of the item
 */
export function addItem(
  root: Directory,
  userAddress: string,
  updateId: number,
  item: AddFileActionData | AddDirectoryActionData,
  itemType: ItemType,
): void {
  if (item.path && (itemType === ItemType.Directory || itemType === ItemType.File)) {
    assertCanCreateItem(root, userAddress, item.path, itemType)
  } else {
    throw new Error('Unknown item type or missing path')
  }

  const parts = getPathParts(item.path)
  const name = parts[parts.length - 1]

  const iterateParts = [userAddress, ...parts.slice(1, parts.length - 1)]
  let currentRoot: Directory = root
  for (let i = 0; i < iterateParts.length; i++) {
    const findPart = iterateParts[i]
    assertDirectories(currentRoot.directories)
    const found: Directory | undefined = currentRoot.directories.find(item => item.name === findPart)

    if (found) {
      currentRoot = found // move currentRoot to found directory
    } else {
      throw new Error(`Add directory: parent directory not found: "${findPart}"`)
    }
  }

  if (itemType === ItemType.Directory) {
    assertDirectories(currentRoot.directories)
    currentRoot.directories.push({
      name,
      files: [],
      directories: [],
      userAddress,
      updateId,
    })
  } else if (itemType === ItemType.File) {
    assertFileActionData(item)
    const preparedItem = {
      name,
      hash: item.hash,
      updateId,
    }
    assertFile(preparedItem)
    assertFiles(currentRoot.files)
    currentRoot.files.push(preparedItem)
  }
}

/**
 * Gets item by path
 *
 * @param path Path to the item
 * @param root Root directory
 */
export function getItem(path: string, root: Directory): Directory | File {
  if (!isValidPath(path)) {
    throw new Error('Invalid path')
  }

  if (root.name !== '/') {
    throw new Error('Root directory should have name "/"')
  }

  const parts = getPathParts(path).slice(1)
  let currentRoot: Directory = root
  for (let i = 0; i < parts.length; i++) {
    const findPart = parts[i]
    assertDirectories(currentRoot.directories)
    const found: Directory | undefined = currentRoot.directories.find(item => item.name === findPart)

    if (found) {
      currentRoot = found // move currentRoot to found directory
    } else {
      assertFiles(currentRoot.files)
      const foundFile: File | undefined = currentRoot.files.find(item => item.name === findPart)

      if (!foundFile) {
        throw new Error(`Get item: file not found: "${findPart}"`)
      }

      return foundFile
    }
  }

  return currentRoot
}
