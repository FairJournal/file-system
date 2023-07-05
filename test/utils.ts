import { getSecureRandomBytes, KeyPair, keyPairFromSeed } from 'ton-crypto'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TonstorageCLI from 'tonstorage-cli'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Creates TON wallet with public and secret keys
 */
export async function createWallet(): Promise<KeyPair> {
  const seed: Buffer = await getSecureRandomBytes(32) // seed is always 32 bytes

  return keyPairFromSeed(seed)
}

/**
 * Generates random Bag ID hash
 */
export function fakeRandomBagIDHash(length = 64): string {
  let result = ''
  const characters = '0123456789ABCDEF'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

/**
 * Creates TON CLI instance
 */
export function createStorageCli(): TonstorageCLI {
  const { TON_CLI_PATH, TON_HOST, TON_DB_PATH, TON_TIMEOUT } = process.env

  if (!TON_CLI_PATH || !TON_HOST || !TON_DB_PATH || !TON_TIMEOUT) {
    throw new Error('TON CLI is not configured in .env file')
  }

  return new TonstorageCLI({
    bin: TON_CLI_PATH,
    host: TON_HOST,
    database: TON_DB_PATH,
    timeout: Number(TON_TIMEOUT),
  })
}
