import { extractDataMeta, MAX_INDEX_LENGTH, MAX_OPENMASK_REAL_LENGTH } from '../../../src/utils/ton/ton'

describe('TON Utils', () => {
  it('extractDataMeta', async () => {
    const items = [
      // check hash for only lowercase letters
      {
        data: 'tfs:1:07123E1F482356C415F684407A3B8723E10B2CBBC0B8FCD6282C49D37C9C1ABC',
        correct: false,
        message: 'Invalid hash. A lowercase hexadecimal string is expected.',
      },
      {
        data: `tfs:${Number.MAX_SAFE_INTEGER + 1}:07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc`,
        correct: false,
        message: `Incorrect index. A number less than 'Number.MAX_SAFE_INTEGER' is expected.`,
      },
      // very large index value
      {
        data: `tfs:${'1'.repeat(
          MAX_INDEX_LENGTH + 1,
        )}:07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc`,
        correct: false,
        message: `Incorrect index length. Expected: 1-35.`,
      },
      // data exceeding MAX_OPENMASK_REAL_LENGTH
      {
        data: 'a'.repeat(MAX_OPENMASK_REAL_LENGTH + 1),
        correct: false,
        message: `Too large personal message. Max length is ${MAX_OPENMASK_REAL_LENGTH}`,
      },
      // empty hash
      {
        data: 'tfs:1:',
        correct: false,
        message: 'The expected hash length is 64 characters.',
      },
      // empty index
      {
        data: 'tfs::07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc',
        correct: false,
        message: 'Incorrect index length. Expected: 1-35.',
      },
      // empty data
      {
        data: '',
        correct: false,
        message: 'Invalid data format',
      },
      // invalid characters in hash
      {
        data: 'tfs:1:07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abz',
        correct: false,
        message: 'Invalid hash. A lowercase hexadecimal string is expected.',
      },
      // short hash
      {
        data: 'tfs:1:07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1ab',
        correct: false,
        message: 'The expected hash length is 64 characters.',
      },
      // long hash
      {
        data: 'tfs:1:07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abaa',
        correct: false,
        message: 'The expected hash length is 64 characters.',
      },
      // char instead of index
      {
        data: 'tfs:a:07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc',
        correct: false,
        message: 'Incorrect index. A number is expected.',
      },
      // incorrect magic word
      {
        data: 'tfz:a:07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc',
        correct: false,
        message: 'Incorrect magic word. Expected: tfs',
      },
      // additional symbol in the end
      {
        data: 'tfs:a:07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc:',
        correct: false,
        message: 'Invalid data format',
      },
      // zero leads index
      {
        data: 'tfs:01:07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc',
        correct: false,
        message: 'Incorrect index. A number without leading zeros is expected.',
      },
      // zero leads index
      {
        data: 'tfs:0:07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc',
        correct: false,
        message: 'Incorrect index. A number without leading zeros is expected.',
      },
      // less than 0 index
      {
        data: 'tfs:-1:07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc',
        correct: false,
        message: 'Incorrect index. A number greater than zero is expected.',
      },
      {
        data: 'tfs:1:07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc',
        correct: true,
        result: {
          index: 1,
          hash: '07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc',
        },
      },
      {
        data: `tfs:${Number.MAX_SAFE_INTEGER}:07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc`,
        correct: true,
        result: {
          index: Number.MAX_SAFE_INTEGER,
          hash: '07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc',
        },
      },
    ]

    items.forEach(item => {
      if (item.correct) {
        expect(extractDataMeta(item.data)).toEqual(item.result)
      } else {
        expect(() => extractDataMeta(item.data)).toThrowError(item.message)
      }
    })
  })
})
