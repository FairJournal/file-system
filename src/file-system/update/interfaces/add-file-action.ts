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
 * @param path Full path to the file
 * @param hash Hash of the file
 */
export function createAddFileAction(path: string, hash: string): AddFileAction {
  if (!path) {
    throw new Error('Path is required')
  }

  if (!hash) {
    throw new Error('Hash is required')
  }

  return {
    actionType: ActionType.addFile,
    actionData: {
      path,
      hash,
    },
  } as AddFileAction
}

/**
 * Asserts that item is a file action
 *
 * @param item Item to check
 */
export function assertFileActionData(item: unknown): asserts item is AddFileActionData {
  const data = item as AddFileActionData

  if (!(data.path && data.hash)) {
    throw new Error('Invalid file action data fields')
  }
}
