import { Buffer } from 'buffer'
// import CryptoJS from 'crypto-js'
// import SHA256 from 'crypto-js/sha256'
// import { MerkleTree } from 'merkletreejs'
//
// interface FileInfo {
//   name: string
//   content: string
// }
//
// // interface FECInfoNone {}
//
// export interface TorrentHeader {
//   filesCount?: number
//   totalNameSize?: bigint
//   totalDataSize?: bigint
//   // fec: FECInfoNone // Assume FECInfoNone is also defined somewhere in your TypeScript code
//   dirNameSize?: number
//   dirName?: Uint8Array
//   nameIndex?: bigint[]
//   dataIndex?: bigint[]
//   names?: Uint8Array
//   data?: Uint8Array
// }
//
// export function bytesToHex(bytes: Uint8Array): string {
//   const hexByte = (n: number) => n.toString(16).padStart(2, '0')
//
//   return Array.from(bytes, hexByte).join('')
// }
//
// export function bytesToWordArray(data: Uint8Array): CryptoJS.lib.WordArray {
//   return CryptoJS.enc.Hex.parse(bytesToHex(data))
// }
//
// function calcHash(cb: Uint8Array): CryptoJS.lib.WordArray {
//   return CryptoJS.SHA256(bytesToWordArray(cb))
// }
//
// export function serialize(data: TorrentHeader, boxed: boolean): string {
//   const buf = Buffer.alloc(24)
//   // id: 2435361463 - "tl.TorrentHeader"
//   const tlTorrentHeader = 2435361463
//   buf.writeUInt32LE(tlTorrentHeader, 0)
//   buf.writeUInt32LE(data.filesCount!, 4)
//   buf.writeBigUInt64LE(data.totalNameSize!, 8)
//   buf.writeBigUInt64LE(data.totalDataSize!, 16)
//
//   // const fecData = await this.fec.serialize(true);
//   // if (!fecData) {
//   //   throw new Error("FEC serialization failed");
//   // }
//
//   const fecBuffer = Buffer.from('64192ac8', 'hex')
//
//   // if (data.dirNameSize !== data.dirName!.length) {
//   //   throw new Error('Incorrect dir name size')
//   // }
//
//   const dirNameSizeBuffer = Buffer.alloc(4)
//   dirNameSizeBuffer.writeUInt32LE(data.dirNameSize!, 0)
//
//   const result = Buffer.concat([
//     buf,
//     fecBuffer,
//     dirNameSizeBuffer,
//     Buffer.from(data.dirName!),
//     ...data.nameIndex!.map(index => {
//       const buffer = Buffer.alloc(8)
//       buffer.writeBigUInt64LE(index, 0)
//
//       return buffer
//     }),
//     ...data.dataIndex!.map(index => {
//       const buffer = Buffer.alloc(8)
//       buffer.writeBigUInt64LE(index, 0)
//
//       return buffer
//     }),
//     Buffer.from(data.names!),
//     Buffer.from(data.data!),
//   ])
//
//   return result.toString('hex')
// }
//
// export function calculateBagID(fileInfo: FileInfo): string {
//   const dataTorrent: TorrentHeader = {
//     filesCount: 1,
//     totalNameSize: BigInt(fileInfo.name.length),
//     totalDataSize: BigInt(0),
//     dirNameSize: 0,
//     dirName: Buffer.alloc(0),
//     nameIndex: [BigInt(fileInfo.name.length)],
//     dataIndex: [BigInt(fileInfo.content.length)],
//     names: Buffer.from(fileInfo.name),
//     data: Buffer.alloc(0),
//   }
//
//   const pieceSize = 128 * 1024
//
//   const cb = new Uint8Array(pieceSize)
//   let cbOffset = 0
//   const hashes: CryptoJS.lib.WordArray[] = []
//   const piecesStartIndexes: number[] = []
//   let pieceStartFileIndex = 0
//   let filesProcessed = 0
//   const process = async (name: string, isHeader: boolean, rd: ReadableStream) => {
//     const reader = rd.getReader()
//
//     // eslint-disable-next-line no-constant-condition
//     while (true) {
//       if (cbOffset === 0) {
//         pieceStartFileIndex = filesProcessed
//       }
//
//       const { value, done } = await reader.read()
//
//       if (done) {
//         break
//       }
//
//       const n = value.byteLength
//       cbOffset += n
//
//       if (cbOffset === cb.length) {
//         const hash = calcHash(cb)
//         hashes.push(hash)
//
//         // save index of file where block starts
//         piecesStartIndexes.push(pieceStartFileIndex)
//
//         cbOffset = 0
//       }
//     }
//
//     if (!isHeader) {
//       // if not header
//       filesProcessed++
//     }
//   }
//
//   // todo serialize should return bytes
//   const serialized = serialize(dataTorrent, true)
//
//   // todo remove this validation
//   if (
//     serialized !==
//     'b7aa2891010000000800000000000000000000000000000064192ac80000000008000000000000000a00000000000000746573742e747874'
//   ) {
//     throw new Error('Incorrect serialized data')
//   }
//
//   // b7aa2891010000000800000000000000000000000000000064192ac80000000008000000000000000a00000000000000746573742e74787431323334353637383930
//   const offsetData = Buffer.concat([Buffer.from(serialized, 'hex'), Buffer.from(fileInfo.content, 'utf8')])
//   // console.log('offsetData', offsetData.toString('hex'))
//   const offsetHash = calcHash(offsetData)
//
//   // 98e904a5db032ecfd6e9fbb4be364cfa0b6759ffac92a04c96c619d4c877f44f
//   console.log('offsetHash', offsetHash.toString(CryptoJS.enc.Hex))
//
//   // hash tree: cf078f3390f0559f0b4e595590abdf92e6e7ebaa1135a18d950da347403b994e
//   const leaves = [offsetHash].map(x => SHA256(x))
//   const tree = new MerkleTree(leaves, SHA256)
//   const root = tree.getRoot().toString('hex')
//   console.log('hash tree', root)
//
//   return ''
// }

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
