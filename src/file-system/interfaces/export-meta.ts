import { Tree } from './tree'
import { UpdateDataSigned } from '../update/interfaces/update-data-signed'
import { User } from './user'
import { KeyNumberMap } from './key-number-map'
import { ReferencedItem } from './referenced-item'

/**
 * Meta data for export
 */
export interface ExportMeta {
  /**
   * Version of the file system
   */
  version: string

  /**
   * Name of the project
   */
  projectName: string

  /**
   * Description of the project
   */
  projectDescription: string

  /**
   * Tree of the file system
   */
  tree: Tree | ReferencedItem

  /**
   * Updates of the file system
   */
  updates?: { [key: string]: UpdateDataSigned[] } | { [key: string]: ReferencedItem } | ReferencedItem

  /**
   * Users of the file system
   */
  users?: User[] | ReferencedItem

  /**
   * User update map
   */
  userUpdateMap?: KeyNumberMap | ReferencedItem
}

/**
 * Asserts that data is an export meta
 *
 * @param data Data to check
 */
export function assertExportMeta(data: unknown): asserts data is ExportMeta {
  const item = data as ExportMeta

  if (!item.version) {
    throw new Error('ExportMeta: "version" is not defined')
  }

  if (!item.projectName) {
    throw new Error('ExportMeta: "projectName" is not defined')
  }

  if (!item.projectDescription) {
    throw new Error('ExportMeta: "projectDescription" is not defined')
  }

  if (!item.tree) {
    throw new Error('ExportMeta: "tree" is not defined')
  }
}
