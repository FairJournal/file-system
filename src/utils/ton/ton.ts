import { signVerify, sign } from 'ton-crypto'
import { Buffer } from 'buffer'
import nacl from 'tweetnacl'

/**
 * Meta information from data
 */
export interface DataMeta {
  /**
   * Index of the update
   */
  index: number

  /**
   * Hash of the update
   */
  hash: string
}

export const MIN_INDEX_LENGTH = 1
export const MAX_INDEX_LENGTH = 35
export const HASH_LENGTH = 64

/**
 * Max length of data in Openmask value
 */
export const MAX_OPENMASK_DATA_LENGTH = 126
/**
 * Max length of data in Openmask value minus 'ton-safe-sign-magic'.length
 */
export const MAX_OPENMASK_REAL_LENGTH = MAX_OPENMASK_DATA_LENGTH - 19
/**
 * According: https://github.com/ton-foundation/specs/blob/main/specs/wtf-0002.md
 */
export const TON_SAFE_SIGN_MAGIC = 'ton-safe-sign-magic'
/**
 * Magic word for data to sign
 */
export const FS_MAGIC = 'tfs'

/**
 * Checks that data is a hex string
 */
function isHex(data: string): boolean {
  const regex = /^[0-9a-f]+$/

  return regex.test(data)
}

/**
 * Extracts meta information from data to sign
 */
export function extractDataMeta(data: string): DataMeta {
  const PARTS_LENGTH = 3

  if (data.length > MAX_OPENMASK_REAL_LENGTH) {
    throw new Error(`Too large personal message. Max length is ${MAX_OPENMASK_REAL_LENGTH}`)
  }

  const parts = data.split(':')

  if (parts.length !== PARTS_LENGTH) {
    throw new Error(`Invalid data format`)
  }

  if (parts[0] !== FS_MAGIC) {
    throw new Error(`Incorrect magic word. Expected: ${FS_MAGIC}`)
  }

  const indexPart = parts[1]

  if (indexPart.startsWith('0')) {
    throw new Error(`Incorrect index. A number without leading zeros is expected.`)
  }

  if (indexPart.length < MIN_INDEX_LENGTH || indexPart.length > MAX_INDEX_LENGTH) {
    throw new Error(`Incorrect index length. Expected: ${MIN_INDEX_LENGTH}-${MAX_INDEX_LENGTH}.`)
  }

  // human-readable index
  const index = parseInt(indexPart, 10)

  if (isNaN(index)) {
    throw new Error(`Incorrect index. A number is expected.`)
  }

  if (index < 1) {
    throw new Error(`Incorrect index. A number greater than zero is expected.`)
  }

  if (index > Number.MAX_SAFE_INTEGER) {
    throw new Error(`Incorrect index. A number less than 'Number.MAX_SAFE_INTEGER' is expected.`)
  }

  const hash = parts[2]

  if (hash.length !== HASH_LENGTH) {
    throw new Error(`The expected hash length is ${HASH_LENGTH} characters.`)
  }

  if (!isHex(hash)) {
    throw new Error(`Invalid hash. A lowercase hexadecimal string is expected.`)
  }

  return {
    index,
    hash,
  }
}

/**
 * Verify personal signature from an extension
 *
 * @param data Data to verify
 * @param signature Signature
 * @param publicKey Public key
 */
export function personalSignVerify(data: string, signature: string, publicKey: string): boolean {
  const checkData = Buffer.concat([
    Buffer.from([0xff, 0xff]),
    Buffer.from(TON_SAFE_SIGN_MAGIC),
    nacl.hash(Buffer.from(data, 'utf8')),
  ])

  return signVerify(checkData, Buffer.from(signature, 'hex'), Buffer.from(publicKey, 'hex'))
}

/**
 * Sign data with secret key like an extension
 *
 * @param data Data to sign
 * @param secretKey Secret key
 */
export function personalSign(data: string, secretKey: Buffer): string {
  return sign(
    Buffer.concat([Buffer.from([0xff, 0xff]), Buffer.from(TON_SAFE_SIGN_MAGIC), Buffer.from(data, 'utf8')]),
    secretKey,
  ).toString('hex')
}

/**
 * Checks that the public key is valid
 *
 * @param publicKey Public key
 */
export function isPublicKeyValid(publicKey: string): boolean {
  return publicKey.length === 64 && isHex(publicKey)
}
