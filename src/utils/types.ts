/**
 * Checks if the data is an object
 *
 * @param data Data to check
 */
export function isObject(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && !Array.isArray(data) && data !== null
}

/**
 * Asserts that the data is an object
 *
 * @param data Data to check
 * @param customError Custom error message
 */
export function assertObject(data: unknown, customError?: string): asserts data is Record<string, unknown> {
  if (!isObject(data)) {
    throw new Error(customError ? customError : 'Data is not an object')
  }
}

/**
 * Asserts that the data is a JSON string
 *
 * @param data
 */
export function assertJson(data: unknown): asserts data is string {
  if (typeof data !== 'string') {
    throw new Error('JSON assert: data is not a string')
  }

  try {
    JSON.parse(data)
  } catch (e) {
    throw new Error(`JSON assert: data is not a valid JSON: ${(e as Error).message}`)
  }
}

/**
 * Deep clones the data
 *
 * @param data Data to clone
 */
export function deepClone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

/**
 * Asserts that the data is a positive number
 *
 * @param data Data to check
 */
export function assertPositiveNumber(data: unknown): asserts data is number {
  if (typeof data !== 'number' || data <= 0) {
    throw new Error('Data is not a positive number')
  }
}
