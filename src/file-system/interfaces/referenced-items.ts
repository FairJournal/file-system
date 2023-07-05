import { assertReferencedItem, ReferencedItem } from './referenced-item'

/**
 * Items value of each is a reference to storage
 */
export interface ReferencedItems {
  /**
   * Items
   */
  [key: string]: ReferencedItem
}

/**
 * Asserts that data is an object with referenced items
 *
 * @param data Data to check
 */
export function assertReferencedItems(data: unknown): asserts data is ReferencedItems {
  const items = data as ReferencedItems

  if (!items) {
    throw new Error('ReferencedItems: data is not an object')
  }

  Object.values(items).forEach(assertReferencedItem)
}
