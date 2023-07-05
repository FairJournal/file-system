import { Directory } from '../directory'

/**
 * Tree of the file system
 */
export interface Tree {
  /**
   * Root directory
   */
  directory: Directory
}

/**
 * Asserts that tree is correct
 *
 * @param data Tree to check
 */
export function assertTree(data: unknown): asserts data is Tree {
  const tree = data as Tree

  if (!tree.directory) {
    throw new Error('Tree: should contain root directory')
  }
}
