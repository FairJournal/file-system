import { Buffer } from 'buffer'

/**
 * Converts base64 string to uppercase hex string
 */
export function base64ToHex(base64: string): string {
  return Buffer.from(base64, 'base64').toString('hex').toUpperCase()
}

/**
 * Converts hex string to base64 string
 */
export function hexToBase64(hex: string): string {
  return Buffer.from(hex, 'hex').toString('base64')
}
