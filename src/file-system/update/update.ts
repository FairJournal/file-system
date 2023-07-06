import { Action, asserAction, assertActions } from './interfaces/action'
import SHA256 from 'crypto-js/sha256'
import CryptoJS from 'crypto-js'
import { personalSignVerify } from '../../utils/ton/ton'
import { UpdateData } from './interfaces/update-data'
import { UpdateDataSigned } from './interfaces/update-data-signed'
import { assertPositiveNumber } from '../../utils/types'

/**
 * Update from the user side for a gateway
 */
export class Update {
  /**
   * Id of the update specific for the user
   * @private
   */
  private id = 0

  /**
   * Signature of the update
   * @private
   */
  private signature = ''

  /**
   * Actions of the update
   * @private
   */
  private actions: Action[] = []

  /**
   * Address or public key of the user
   * @private
   */
  private userAddress = ''

  /**
   * Creates update
   *
   * @param projectName Name of the project
   * @param userAddress Address or public key of the user
   * @param id Id of the update
   */
  constructor(public projectName: string, userAddress?: string, id?: number) {
    this.setUserAddress(userAddress || '')

    if (id !== undefined) {
      this.setId(id)
    }
  }

  /**
   * Adds action to the update
   */
  addAction(action: Action): void {
    asserAction(action)
    this.actions.push(action)
  }

  /**
   * Sets actions of the update
   * @param actions Actions of the update
   */
  setActions(actions: Action[]): void {
    assertActions(actions)
    this.actions = actions
  }

  /**
   * Returns all actions
   */
  getActions(): Action[] {
    return this.actions
  }

  /**
   * Returns sha256 of data to sign
   */
  getSignData(): string {
    if (!this.id) {
      throw new Error('Id is required')
    }

    if (!this.projectName) {
      throw new Error('Project name is required')
    }

    if (!this.actions.length) {
      throw new Error('Actions are required')
    }

    if (!this.userAddress) {
      throw new Error('User address is required')
    }

    const updateData: UpdateData = {
      id: this.id,
      projectName: this.projectName,
      actions: this.actions,
      userAddress: this.userAddress,
    }

    return SHA256(JSON.stringify(updateData)).toString(CryptoJS.enc.Hex)
  }

  /**
   * Sets signature of the update
   */
  setSignature(signature: string): void {
    if (!signature) {
      throw new Error('Signature is required')
    }

    if (!personalSignVerify(this.getSignData(), signature, this.userAddress)) {
      throw new Error('Signature is invalid')
    }

    this.signature = signature.toLowerCase()
  }

  /**
   * Returns signature of the update
   */
  getSignature(): string {
    return this.signature
  }

  /**
   * Returns address of the user
   */
  getUserAddress(): string {
    return this.userAddress
  }

  /**
   * Sets address of the user
   *
   * @param userAddress Address of the user
   */
  setUserAddress(userAddress: string): void {
    this.userAddress = userAddress.toLowerCase()
  }

  /**
   * Sets id of the update
   */
  setId(id: number): void {
    assertPositiveNumber(id)
    this.id = id
  }

  /**
   * Returns id of the update
   */
  getId(): number {
    return this.id
  }

  getUpdateDataSigned(): UpdateDataSigned {
    if (!this.id) {
      throw new Error('Id is required')
    }

    if (!this.projectName) {
      throw new Error('Project name is required')
    }

    if (!this.actions.length) {
      throw new Error('Actions are required')
    }

    if (!this.userAddress) {
      throw new Error('User address is required')
    }

    if (!this.signature) {
      throw new Error('Signature is required')
    }

    return {
      id: this.id,
      projectName: this.projectName,
      actions: this.actions,
      userAddress: this.userAddress,
      signature: this.signature,
    }
  }
}
