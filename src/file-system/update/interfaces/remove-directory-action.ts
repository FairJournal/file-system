import { Action, ActionType } from './action'

/**
 * Remove directory action data
 */
export interface RemoveDirectoryActionData {
  /**
   * Full path to the directory in virtual file system
   */
  path: string
}

/**
 * Remove directory action
 */
export interface RemoveDirectoryAction extends Action {
  /**
   * Action data
   */
  actionData: RemoveDirectoryActionData
}

/**
 * Create remove directory action
 *
 * @param path Full path to the directory in virtual file system
 */
export function createRemoveDirectoryAction(path: string): RemoveDirectoryAction {
  if (!path) {
    throw new Error('Path is required')
  }

  return {
    actionType: ActionType.removeDirectory,
    actionData: {
      path,
    },
  } as RemoveDirectoryAction
}
