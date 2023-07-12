import { NamedItem } from './interfaces/named-item'

/**
 * File in the file system
 */
export interface File extends NamedItem {
  /**
   * Hash of the file
   */
  hash: string

  /**
   * Mime type of the file
   */
  mimeType: string

  /**
   * Size of the file in bytes
   */
  size: number

  /**
   * Update where directory was created
   */
  updateId: number
}

/**
 * Checks if data is a file
 *
 * @param data Data to check
 */
export function isFile(data: unknown): boolean {
  try {
    assertFile(data)

    return true
  } catch (e) {
    return false
  }
}

/**
 * Asserts that item is a file
 *
 * @param item Item to check
 */
export function assertFile(item: unknown): asserts item is File {
  const data = item as File

  if (!(data.name && data.hash && data.mimeType && data.size && data.updateId)) {
    throw new Error('Invalid file fields')
  }
}

/**
 * Asserts that data is an array of files
 *
 * @param data Data to check
 */
export function assertFiles(data: unknown): asserts data is File[] {
  const item = data as File[]

  if (!Array.isArray(item)) {
    throw new Error('File: data is not an array of files')
  }

  item.forEach(assertFile)
}
