import { ExportMetaOptions } from './interfaces/export-meta-options'

/**
 * Version of the file system
 */
export const FS_VERSION = '0.0.1'

/**
 * Default options for export meta
 */
export const DEFAULT_EXPORT_META_OPTIONS: ExportMetaOptions = {
  /**
   * Include updates to export
   */
  withUpdates: true,

  /**
   * Include users to export
   */
  withUsers: true,

  /**
   * Include user update map to export
   */
  withUserUpdateMap: true,
}

/**
 * Maximum actions per update
 */
export const MAX_ACTIONS_PER_UPDATE = 100
