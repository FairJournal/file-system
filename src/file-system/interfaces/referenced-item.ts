/**
 * Item that can be referenced to storage
 */
export interface ReferencedItem {
  /**
   * Reference to storage
   */
  reference: string
}

/**
 * Asserts that data is a referenced item
 *
 * @param data Data to check
 */
export function assertReferencedItem(data: unknown): asserts data is ReferencedItem {
  const item = data as ReferencedItem

  if (!item.reference) {
    throw new Error('ReferencedItem: reference is not defined')
  }
}
