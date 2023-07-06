import { FileSystem } from './file-system'
import { Directory } from './file-system/directory'
import { File } from './file-system/file'
import { Tree } from './file-system/interfaces/tree'
import { Update } from './file-system/update/update'
import { Action, ActionType } from './file-system/update/interfaces/action'
import { UpdateDataSigned } from './file-system/update/interfaces/update-data-signed'

export { FileSystem, Directory, File, Tree, Update, Action, UpdateDataSigned, ActionType }

declare global {
  interface Window {
    imfs: {
      FileSystem: typeof import('./file-system').FileSystem
    }
  }
}
