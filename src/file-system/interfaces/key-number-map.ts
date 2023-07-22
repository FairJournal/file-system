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
  if (typeof data !== 'object' || data === null) {
    throw new Error('KeyNumberMap: data is not an object')
  }

  const item = data as Record<string, unknown>

  for (const key in item) {
    if (typeof item[key] !== 'number') {
      throw new Error('KeyNumberMap: value is not a number')
    }
  }
}
