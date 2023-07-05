import { assertObject } from '../../utils/types'

/**
 * Key number interface
 */
export interface KeyNumberMap {
  /**
   * Key-number map
   */
  [key: string]: number
}

/**
 * Asserts that data is a key-number map
 *
 * @param data Data to check
 */
export function assertKeyNumberMap(data: unknown): asserts data is KeyNumberMap {
  const item = data as KeyNumberMap

  assertObject(item, 'KeyNumberMap: data is not an object')

  Object.values(item).forEach(value => {
    if (typeof value !== 'number') {
      throw new Error('KeyNumberMap: value is not a number')
    }
  })
}
