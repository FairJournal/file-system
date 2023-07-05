import { UpdateData } from './update-data'

/**
 * Update data signed
 */
export interface UpdateDataSigned extends UpdateData {
  /**
   * Signature of the update
   */
  signature: string
}

/**
 * Asserts that data is an update data signed
 *
 * @param data Data to check
 */
export function assertUpdateDataSigned(data: unknown): asserts data is UpdateDataSigned {
  const item = data as UpdateDataSigned

  if (!item.signature) {
    throw new Error('UpdateDataSigned: signature is not defined')
  }
}

/**
 * Asserts that data is an array of update data signed
 *
 * @param data Data to check
 */
export function assertUpdateDataSignedArray(data: unknown): asserts data is UpdateDataSigned[] {
  const items = data as UpdateDataSigned[]

  if (!Array.isArray(items)) {
    throw new Error('UpdateDataSigned: data is not an array')
  }

  items.forEach(assertUpdateDataSigned)
}

/**
 * Asserts that data is an object of update data signed
 *
 * @param data Data to check
 */
export function assertUpdateDataSignedObject(data: unknown): asserts data is { [key: string]: UpdateDataSigned[] } {
  const items = data as { [key: string]: UpdateDataSigned[] }

  if (typeof items !== 'object' || Array.isArray(items) || items === null) {
    throw new Error('UpdateDataSigned: data is not an object')
  }

  Object.values(items).forEach(assertUpdateDataSignedArray)
}
