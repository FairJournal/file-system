/**
 * Action type
 */
export enum ActionType {
  /**
   * Add user to the project
   */
  addUser = 'ADD_USER',

  /**
   * Remove user from the project
   */
  removeUser = 'REMOVE_USER',

  /**
   * Add file to the user scope
   */
  addFile = 'ADD_FILE',

  /**
   * Remove file from the user scope
   */
  removeFile = 'REMOVE_FILE',

  /**
   * Modify file in the user scope
   */
  modifyFile = 'MODIFY_FILE',

  /**
   * Move file in the user scope
   */
  moveFile = 'MOVE_FILE',

  /**
   * Add directory to the user scope
   */
  addDirectory = 'ADD_DIRECTORY',

  /**
   * Remove directory from the user scope
   */
  removeDirectory = 'REMOVE_DIRECTORY',

  /**
   * Modify directory in the user scope
   */
  modifyDirectory = 'MODIFY_DIRECTORY',

  /**
   * Move directory in the user scope
   */
  moveDirectory = 'MOVE_DIRECTORY',
}

/**
 * Action
 */
export interface Action {
  /**
   * Action type
   */
  actionType: ActionType

  /**
   * Action data
   */
  actionData: unknown
}

/**
 * Asserts that data is an action
 *
 * @param data Data to check
 */
export function asserAction(data: unknown): asserts data is Action {
  const item = data as Action

  if (!item.actionType) {
    throw new Error('Action: "actionType" is not defined')
  }

  if (!item.actionData) {
    throw new Error('Action: "actionData" is not defined')
  }
}

/**
 * Asserts that data is an array of actions
 *
 * @param data Data to check
 */
export function assertActions(data: unknown): asserts data is Action[] {
  const items = data as Action[]

  if (!items) {
    throw new Error('Actions: data is not an array')
  }

  items.forEach(asserAction)
}
