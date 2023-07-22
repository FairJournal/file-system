import { Action, ActionType } from './action'

/**
 * Remove file action data
 */
export interface RemoveFileActionData {
  /**
   * Full path to the file in virtual file system
   */
  path: string
}

/**
 * Remove file action
 */
export interface RemoveFileAction extends Action {
  /**
   * Action data
   */
  actionData: RemoveFileActionData
}

/**
 * Create remove file action
 *
 * @param path Full path to the file in virtual file system
 */
export function createRemoveFileAction(path: string): RemoveFileAction {
  if (!path) {
    throw new Error('Path is required')
  }

  return {
    actionType: ActionType.removeFile,
    actionData: {
      path,
    },
  } as RemoveFileAction
}

/**
 * Asserts that item is a remove file action
 *
 * @param item Item to check
 */
export function assertRemoveFileActionData(item: unknown): asserts item is RemoveFileActionData {
  const data = item as RemoveFileActionData

  if (!data.path) {
    throw new Error('Remove file action data: invalid path')
  }
}
