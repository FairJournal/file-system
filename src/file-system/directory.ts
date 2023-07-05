import { NamedItem } from './interfaces/named-item'
import { File } from './file'

import { ReferencedItem } from './interfaces/referenced-item'

/**
 * Directory item
 */
export interface Directory extends NamedItem {
  /**
   * Files in the directory
   */
  files: File[] | ReferencedItem

  /**
   * Directories in the directory
   */
  directories: Directory[] | ReferencedItem

  /**
   * Address of the user who created the directory
   */
  userAddress: string

  /**
   * Update where directory was created
   */
  updateId: number
}

/**
 * Asserts that item is a directory
 *
 * @param data Item to check
 */
export function assertDirectory(data: unknown): asserts data is Directory {
  const item = data as Directory

  if (!item.name) {
    throw new Error('Directory: name is not defined')
  }

  if (!item.files) {
    throw new Error('Directory: files are not defined')
  }

  if (!item.directories) {
    throw new Error('Directory: directories are not defined')
  }

  if (!item.userAddress) {
    throw new Error('Directory: user address is not defined')
  }

  if (!item.updateId) {
    throw new Error('Directory: update id is not defined or 0')
  }
}

/**
 * Asserts that data is an array of directories
 * @param data Data to check
 */
export function assertDirectories(data: unknown): asserts data is Directory[] {
  const item = data as Directory[]

  if (!Array.isArray(item)) {
    throw new Error('Directory: data is not an array')
  }

  item.forEach(assertDirectory)
}
