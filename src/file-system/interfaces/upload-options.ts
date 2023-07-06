import { ReferencedItem } from './referenced-item'

/**
 * Upload options
 */
export interface UploadOptions {
  /**
   * Custom function for uploading data
   *
   * @param data Data to upload
   * @returns Reference to the uploaded data
   */
  uploadData: (data: string) => Promise<ReferencedItem>
}
