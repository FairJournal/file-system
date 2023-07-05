import CryptoJS from 'crypto-js'

export function bytesToHex(bytes: Uint8Array): string {
  const hexByte = (n: number) => n.toString(16).padStart(2, '0')

  return Array.from(bytes, hexByte).join('')
}

export function bytesToWordArray(data: Uint8Array): CryptoJS.lib.WordArray {
  return CryptoJS.enc.Hex.parse(bytesToHex(data))
}
