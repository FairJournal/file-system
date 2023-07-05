import { Action } from './action'

/**
 * Update data
 */
export interface UpdateData {
  /**
   * Id of the update
   */
  id: number

  /**
   * Name of the project
   */
  projectName: string

  /**
   * Actions of the update
   */
  actions: Action[]

  /**
   * Address or public key of the user
   */
  userAddress: string
}
