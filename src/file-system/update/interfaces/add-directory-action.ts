import { Action, ActionType } from './action'

/**
 * Add directory action data
 */
export interface AddDirectoryActionData {
  /**
   * Full path to the directory in virtual file system
   */
  path: string
}

/**
 * Add directory action
 */
export interface AddDirectoryAction extends Action {
  /**
   * Action data
   */
  actionData: AddDirectoryActionData
}

/**
 * Create add directory action
 *
 * @param path Full path to the directory in virtual file system
 */
export function createAddDirectoryAction(path: string): AddDirectoryAction {
  if (!path) {
    throw new Error('Path is required')
  }

  return {
    actionType: ActionType.addDirectory,
    actionData: {
      path,
    },
  } as AddDirectoryAction
}
