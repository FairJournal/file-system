import { FileSystem } from './file-system'
import { Directory } from './file-system/directory'
import { File } from './file-system/file'
import { Tree } from './file-system/interfaces/tree'

export { FileSystem, Directory, File, Tree }

declare global {
  interface Window {
    imfs: {
      FileSystem: typeof import('./file-system').FileSystem
    }
  }
}
