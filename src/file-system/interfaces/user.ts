/**
 * User of the project
 */
export interface User {
  /**
   * User address
   */
  address: string
}

/**
 * Asserts that data is a user
 *
 * @param data Data to check
 */
export function assertUser(data: unknown): asserts data is User {
  const item = data as User

  if (!item.address) {
    throw new Error('User: address is not defined')
  }
}

/**
 * Asserts that data is an array of users
 *
 * @param data Data to check
 */
export function assertUsers(data: unknown): asserts data is User[] {
  const items = data as User[]

  if (!Array.isArray(items)) {
    throw new Error('Users: data is not an array')
  }

  items.forEach(assertUser)
}
