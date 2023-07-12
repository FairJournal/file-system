import { base64ToHex, hexToBase64 } from '../../../src/utils/ton/storage'

describe('TON Storage', () => {
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
