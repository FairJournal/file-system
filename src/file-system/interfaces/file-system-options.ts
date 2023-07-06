/**
 * Options for file system
 */
export interface FileSystemOptions {
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
   * Check signature algorithm
   */
  checkSignature: ((name: string, ownerAddress: string, signature: string) => boolean) | 'ton'
}
