import { FileSystem } from './file-system'
import { Directory, assertDirectory, assertDirectories, isDirectory } from './file-system/directory'
import { File, assertFile, assertFiles, isFile } from './file-system/file'
import { Tree } from './file-system/interfaces/tree'
import { Update } from './file-system/update/update'
import { Action, ActionType } from './file-system/update/interfaces/action'
import { UpdateDataSigned } from './file-system/update/interfaces/update-data-signed'
import {
  createAddDirectoryAction,
  AddDirectoryActionData,
  AddDirectoryAction,
} from './file-system/update/interfaces/add-directory-action'
import { createAddUserAction, AddUserActionData, AddUserAction } from './file-system/update/interfaces/add-user-action'
import { createAddFileAction, AddFileActionData, AddFileAction } from './file-system/update/interfaces/add-file-action'

export {
  FileSystem,
  Directory,
  File,
  Tree,
  Update,
  Action,
  UpdateDataSigned,
  ActionType,
  createAddDirectoryAction,
  AddDirectoryActionData,
  AddDirectoryAction,
  createAddUserAction,
  AddUserActionData,
  AddUserAction,
  createAddFileAction,
  AddFileActionData,
  AddFileAction,
  assertDirectory,
  assertDirectories,
  assertFile,
  assertFiles,
  isDirectory,
  isFile,
}

declare global {
  interface Window {
    imfs: {
      FileSystem: typeof import('./file-system').FileSystem
    }
  }
}
