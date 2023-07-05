import { ReferencedItem } from './referenced-item'

/**
 * Download options
 */
export interface DownloadOptions {
  /**
   * Custom function for downloading data
   *
   * @param data Data to download
   */
  downloadData?: (data: ReferencedItem) => Promise<string>

  /**
   * Download updates
   */
  withUpdates?: boolean
}
