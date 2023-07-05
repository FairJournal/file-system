import { base64ToHex, hexToBase64 } from '../../../src/utils/ton/storage'

describe('TON Storage', () => {
//   it('calculateHash', async () => {
//     const name = 'test.txt'
//     const content = '1234567890'
//     const hash = 'A29FB233D522ACBA2FC65C61EB98BCDF2112F7B518A01BB3E311D1A10C6BAF58'
//     const data = {
//       '@type': 'storage.daemon.torrentFull',
//       torrent: {
//         '@type': 'storage.daemon.torrent',
//         hash: 'op+yM9UirLovxlxh65i83yES97UYoBuz4xHRoQxrr1g=',
//         flags: 3,
//         total_size: '66',
//         description: '',
//         files_count: '1',
//         included_size: '66',
//         dir_name: '',
//         downloaded_size: '66',
//         added_at: 1687703225,
//         root_dir: '/Users/test/ton-build/storage/storage-daemon/',
//         active_download: false,
//         active_upload: true,
//         completed: true,
//         download_speed: 0.0,
//         upload_speed: 0.0,
//         fatal_error: '',
//       },
//       files: [
//         {
//           '@type': 'storage.daemon.fileInfo',
//           name: 'test.txt',
//           size: '10',
//           priority: 1,
//           downloaded_size: '10',
//         },
//       ],
//     }
//     // expect(
//     //   calculateHash({
//     //     name: 'test.txt',
//     //     content,
//     //   }),
//     // ).toEqual(hash)
//
//     const expectedHeader =
//       'b7aa2891010000000800000000000000000000000000000064192ac80000000008000000000000000a00000000000000746573742e747874'
//     const dataTorrent: TorrentHeader = {
//       filesCount: 1,
//       totalNameSize: BigInt(8),
//       totalDataSize: BigInt(0),
//       dirNameSize: 0,
//       dirName: Buffer.alloc(0),
//       nameIndex: [BigInt(8)],
//       dataIndex: [BigInt(10)],
//       names: Buffer.from('test.txt'),
//       data: Buffer.alloc(0),
//     }
//     expect(serialize(dataTorrent, true)).toEqual(expectedHeader)
//
//     expect(
//       calculateBagID({
//         name,
//         content,
//       }),
//     ).toEqual(hash)
//   })

  it('base64ToHex', async () => {
    expect(base64ToHex('op+yM9UirLovxlxh65i83yES97UYoBuz4xHRoQxrr1g=')).toEqual(
      'A29FB233D522ACBA2FC65C61EB98BCDF2112F7B518A01BB3E311D1A10C6BAF58',
    )
  })

  it('hexToBase64', async () => {
    expect(hexToBase64('A29FB233D522ACBA2FC65C61EB98BCDF2112F7B518A01BB3E311D1A10C6BAF58')).toEqual(
      'op+yM9UirLovxlxh65i83yES97UYoBuz4xHRoQxrr1g=',
    )
  })
})
