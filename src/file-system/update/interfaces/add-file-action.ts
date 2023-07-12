import { Action, ActionType } from './action'

/**
 * Add file action data
 */
export interface AddFileActionData {
  /**
   * Full path to the file in virtual file system
   */
  path: string

  /**
   * Mime type of the file
   */
  mimeType: string

  /**
   * Size of the file in bytes
   */
  size: number

  /**
   * Hash of the file
   */
  hash: string
}

/**
 * Add file action
 */
export interface AddFileAction extends Action {
  /**
   * Action data
   */
  actionData: AddFileActionData
}

/**
 * Create add file action
 *
 * @param data Action data
 */
export function createAddFileAction(data: AddFileActionData): AddFileAction {
  assertFileActionData(data)

  return {
    actionType: ActionType.addFile,
    actionData: data,
  } as AddFileAction
}

/**
 * Asserts that item is a file action
 *
 * @param item Item to check
 */
export function assertFileActionData(item: unknown): asserts item is AddFileActionData {
  const data = item as AddFileActionData

  if (!data.path) {
    throw new Error('File action data: invalid path')
  }

  if (!data.hash) {
    throw new Error('File action data: invalid hash')
  }

  if (!data.mimeType) {
    throw new Error('File action data: invalid mime type')
  }

  if (!data.size) {
    throw new Error('File action data: invalid size')
  }
}
