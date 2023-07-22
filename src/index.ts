import { FileSystem } from './file-system'
import { Directory, assertDirectory, assertDirectories, isDirectory } from './file-system/directory'
import { File, assertFile, assertFiles, isFile } from './file-system/file'
import { Tree } from './file-system/interfaces/tree'
import { Update } from './file-system/update/update'
import { Action, ActionType } from './file-system/update/interfaces/action'
import {
  UpdateDataSigned,
  assertUpdateDataSigned,
  assertUpdateDataSignedArray,
  assertUpdateDataSignedObject,
} from './file-system/update/interfaces/update-data-signed'
import {
  createAddDirectoryAction,
  AddDirectoryActionData,
  AddDirectoryAction,
} from './file-system/update/interfaces/add-directory-action'
import { createAddUserAction, AddUserActionData, AddUserAction } from './file-system/update/interfaces/add-user-action'
import { createAddFileAction, AddFileActionData, AddFileAction } from './file-system/update/interfaces/add-file-action'
import {
  createRemoveFileAction,
  RemoveFileActionData,
  RemoveFileAction,
} from './file-system/update/interfaces/remove-file-action'
import {
  createRemoveDirectoryAction,
  RemoveDirectoryActionData,
  RemoveDirectoryAction,
} from './file-system/update/interfaces/remove-directory-action'
import { personalSignVerify, personalSign } from './utils/ton/ton'

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
  assertUpdateDataSigned,
  assertUpdateDataSignedArray,
  assertUpdateDataSignedObject,
  personalSignVerify,
  personalSign,
  createRemoveFileAction,
  RemoveFileActionData,
  RemoveFileAction,
  createRemoveDirectoryAction,
  RemoveDirectoryActionData,
  RemoveDirectoryAction,
}

declare global {
  interface Window {
    imfs: {
      FileSystem: typeof import('./file-system').FileSystem
    }
  }
}
