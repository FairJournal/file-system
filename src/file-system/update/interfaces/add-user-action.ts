import { Action, ActionType } from './action'

/**
 * Add user action data
 */
export interface AddUserActionData {
  /**
   * User address
   */
  userAddress: string
}

/**
 * Add user action
 */
export interface AddUserAction extends Action {
  /**
   * Action data
   */
  actionData: AddUserActionData
}

/**
 * Create add user action
 *
 * @param userAddress User address (or public key)
 */
export function createAddUserAction(userAddress: string): AddUserAction {
  return {
    actionType: ActionType.addUser,
    actionData: {
      userAddress,
    },
  } as AddUserAction
}
