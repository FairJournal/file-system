import { addItem, assertCanCreateItem, getItem, ItemType } from '../../src/utils/path'
import { AddFileActionData, Directory, Tree } from '../../src'
import { fakeRandomBagIDHash } from '../utils'
import { assertDirectories, assertDirectory, isDirectory } from '../../src/file-system/directory'
import { assertFiles } from '../../src/file-system/file'

describe('Path Utils', () => {
  it('assertCanCreateItem', async () => {
    const items = [
      {
        path: '/hello-world',
        address: '0x123',
        root: [
          {
            name: '0x123',
            directories: [],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ] as Directory[],
        isCorrect: true,
        message: '',
      },

      {
        path: '/hello',
        address: '0x123',
        root: [
          {
            name: '0x123',
            directories: [],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ] as Directory[],
        isCorrect: true,
        message: '',
      },

      {
        path: '/hello/one',
        address: '0x123',
        root: [
          {
            name: '0x123',
            directories: [
              {
                name: 'hello',
                directories: [],
                files: [],
                userAddress: '0x999',
                updateId: 1,
              },
            ],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ] as Directory[],
        isCorrect: true,
        message: '',
      },

      // empty name of the directory
      {
        path: '/hello/',
        address: '0x123',
        root: [
          {
            name: '0x123',
            directories: [
              {
                name: 'hello',
                directories: [],
                files: [],
                userAddress: '0x999',
                updateId: 1,
              },
            ],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ] as Directory[],
        isCorrect: false,
        message: 'Name of the directory is required',
      },

      // incorrect user path
      {
        path: '/hello',
        address: '0x123',
        root: [
          {
            name: '0x1234',
            directories: [],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ] as Directory[],
        isCorrect: false,
        message: 'Parent directory not found: "0x123"',
      },

      // no parent directory
      {
        path: '/hello/one',
        address: '0x123',
        root: [
          {
            name: '0x123',
            directories: [],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ] as Directory[],
        isCorrect: false,
        message: 'Parent directory not found: "hello"',
      },

      // no parent directory
      {
        path: '/hello/one/two',
        address: '0x123',
        root: [
          {
            name: '0x123',
            directories: [],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ] as Directory[],
        isCorrect: false,
        message: 'Parent directory not found: "hello"',
      },

      // invalid path
      {
        path: '/..',
        address: '0x123',
        root: [
          {
            name: '0x123',
            directories: [],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ] as Directory[],
        isCorrect: false,
        message: 'Invalid path',
      },

      // invalid path
      {
        path: '/hello.txt',
        address: '0x123',
        root: [
          {
            name: '0x123',
            directories: [],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ] as Directory[],
        isCorrect: false,
        message: 'Invalid path',
      },

      // invalid path
      {
        path: '/',
        address: '0x123',
        root: [
          {
            name: '0x123',
            directories: [],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ] as Directory[],
        isCorrect: false,
        message: 'Path should be absolute and contain at least one component',
      },

      // empty path
      {
        path: '',
        address: '0x123',
        root: [
          {
            name: '0x123',
            directories: [],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ] as Directory[],
        isCorrect: false,
        message: 'Invalid path',
      },

      // just component name
      {
        path: 'hello',
        address: '0x123',
        root: [
          {
            name: '0x123',
            directories: [],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ] as Directory[],
        isCorrect: false,
        message: 'Incorrect path. Should start with "/"',
      },

      // directory already exists
      {
        path: '/hello',
        address: '0x123',
        root: [
          {
            name: '0x123',
            directories: [
              {
                name: 'hello',
                directories: [],
                files: [],
                userAddress: '0x999',
                updateId: 1,
              },
            ],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ] as Directory[],
        isCorrect: false,
        message: 'Directory already exists',
      },

      // parent component not found
      {
        path: '/abc/one/two',
        address: '0x123',
        root: [
          {
            name: '0x123',
            directories: [
              {
                name: 'abc',
                directories: [],
                files: [],
                userAddress: '0x999',
                updateId: 1,
              },
            ],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ] as Directory[],
        isCorrect: false,
        message: 'Parent directory not found: "one"',
      },
    ]

    for (const item of items) {
      if (item.isCorrect) {
        expect(() =>
          assertCanCreateItem(
            {
              name: '/',
              directories: item.root,
              files: [],
              userAddress: '0x999',
              updateId: 1,
            },
            item.address,
            item.path,
            ItemType.Directory,
          ),
        ).not.toThrow()
      } else {
        expect(() =>
          assertCanCreateItem(
            {
              name: '/',
              directories: item.root,
              files: [],
              userAddress: '0x999',
              updateId: 1,
            },
            item.address,
            item.path,
            ItemType.Directory,
          ),
        ).toThrowError(item.message)
      }
    }
  })

  it('addDirectory - correct behaviour', async () => {
    const root: Directory[] = [
      {
        name: '0x123',
        directories: [
          {
            name: 'one',
            directories: [],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ],
        files: [],
        userAddress: '0x999',
        updateId: 1,
      },
    ]
    const newPath = '/one/two'

    assertDirectories(root[0].directories)
    expect(root[0].directories[0].directories).toHaveLength(0)
    addItem(
      {
        name: '/',
        directories: root,
        files: [],
        userAddress: '0x999',
        updateId: 1,
      },
      '0x123',
      1,
      { path: newPath },
      ItemType.Directory,
    )

    assertDirectories(root[0].directories[0].directories)
    expect(root[0].directories[0].directories).toHaveLength(1)
    expect(root[0].directories[0].directories[0].name).toEqual('two')
  })

  it('addDirectory - file correct behaviour', async () => {
    const root: Directory[] = [
      {
        name: '0x123',
        directories: [
          {
            name: 'one',
            directories: [],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ],
        files: [],
        userAddress: '0x999',
        updateId: 1,
      },
    ]
    const newPath = '/one/file'

    assertDirectories(root[0].directories)
    expect(root[0].directories[0].directories).toHaveLength(0)
    addItem(
      {
        name: '/',
        directories: root,
        files: [],
        userAddress: '0x999',
        updateId: 1,
      },
      '0x123',
      1,
      { path: newPath, mimeType: 'text/plain', size: 1, hash: fakeRandomBagIDHash() } as AddFileActionData,
      ItemType.File,
    )
    expect(root[0].directories[0].files).toHaveLength(1)
    assertFiles(root[0].directories[0].files)
    expect(root[0].directories[0].files[0].name).toEqual('file')
  })

  it('addDirectory - additional slash in the end', async () => {
    const root: Directory[] = [
      {
        name: '0x123',
        directories: [
          {
            name: 'one',
            directories: [],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ],
        files: [],
        userAddress: '0x999',
        updateId: 1,
      },
    ]
    const newPath = '/one/two/'

    expect(() =>
      addItem(
        {
          name: '/',
          directories: root,
          files: [],
          userAddress: '0x999',
          updateId: 1,
        },
        '0x123',
        1,
        { path: newPath },
        ItemType.Directory,
      ),
    ).toThrow('Name of the directory is required')
  })

  it('addDirectory - backward slash in the end', async () => {
    const root: Directory[] = [
      {
        name: '0x123',
        directories: [
          {
            name: 'one',
            directories: [],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ],
        files: [],
        userAddress: '0x999',
        updateId: 1,
      },
    ]
    const newPath = '/one/two\\'

    expect(() =>
      addItem(
        {
          name: '/',
          directories: root,
          files: [],
          userAddress: '0x999',
          updateId: 1,
        },
        '0x123',
        1,
        { path: newPath },
        ItemType.Directory,
      ),
    ).toThrow('Invalid path')
  })

  it('getItem - no recursive', () => {
    const tree: Tree = {
      directory: {
        name: '/',
        directories: [
          {
            name: '0x123',
            directories: [
              {
                name: 'one',
                directories: [
                  {
                    name: 'one_one',
                    directories: [
                      {
                        name: 'one',
                        directories: [],
                        files: [],
                        userAddress: '0x999',
                        updateId: 1,
                      },
                    ],
                    files: [],
                    userAddress: '0x999',
                    updateId: 1,
                  },
                  {
                    name: 'one_two',
                    directories: [
                      {
                        name: 'one',
                        directories: [],
                        files: [],
                        userAddress: '0x999',
                        updateId: 1,
                      },
                    ],
                    files: [],
                    userAddress: '0x999',
                    updateId: 1,
                  },
                ],
                files: [
                  {
                    name: 'onefile',
                    mimeType: 'text/plain',
                    size: 1,
                    hash: 'somehash',
                    updateId: 1,
                  },
                  {
                    name: 'one1file',
                    mimeType: 'text/plain',
                    size: 1,
                    hash: 'somehash',
                    updateId: 1,
                  },
                ],
                userAddress: '0x999',
                updateId: 1,
              },
            ],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ],
        files: [],
        userAddress: 'someaddress',
        updateId: 1,
      },
    }

    const items = [
      {
        path: '/',
        isDirectory: true,
        name: '/',
        directoriesCount: 1,
        filesCount: 0,
        isCorrect: true,
      },
      {
        path: '/0x123/one',
        isDirectory: true,
        name: 'one',
        directoriesCount: 2,
        filesCount: 2,
        isCorrect: true,
      },
      {
        path: '/0x123/one/onefile',
        isDirectory: false,
        name: 'onefile',
        directoriesCount: 0,
        filesCount: 0,
        isCorrect: true,
      },
      {
        path: '/0x123/one/onez',
        isDirectory: false,
        name: '',
        directoriesCount: 0,
        filesCount: 0,
        isCorrect: false,
        error: 'Get item: file not found: "onez"',
      },
      {
        path: '',
        isDirectory: false,
        name: '',
        directoriesCount: 0,
        filesCount: 0,
        isCorrect: false,
        error: 'Invalid path',
      },
    ]

    for (const item of items) {
      if (item.isCorrect) {
        const foundItem = getItem(item.path, tree.directory)
        const isFoundDirectory = isDirectory(foundItem)
        expect(isFoundDirectory).toEqual(item.isDirectory)
        expect(foundItem.name).toEqual(item.name)

        if (isFoundDirectory) {
          assertDirectory(foundItem)
          expect(foundItem.directories).toHaveLength(item.directoriesCount)
          expect(foundItem.files).toHaveLength(item.filesCount)
        }
      } else {
        expect(() => getItem(item.path, tree.directory)).toThrowError(item.error)
      }
    }
  })

  it('getItem - recursive', () => {
    const tree: Tree = {
      directory: {
        name: '/',
        directories: [
          {
            name: '0x123',
            directories: [
              {
                name: 'one',
                directories: [
                  {
                    name: 'one_one',
                    directories: [
                      {
                        name: 'one111',
                        directories: [],
                        files: [],
                        userAddress: '0x999',
                        updateId: 1,
                      },
                    ],
                    files: [],
                    userAddress: '0x999',
                    updateId: 1,
                  },
                  {
                    name: 'one_two',
                    directories: [
                      {
                        name: 'one222',
                        directories: [],
                        files: [],
                        userAddress: '0x999',
                        updateId: 1,
                      },
                    ],
                    files: [],
                    userAddress: '0x999',
                    updateId: 1,
                  },
                ],
                files: [
                  {
                    name: 'onefile',
                    mimeType: 'text/plain',
                    size: 1,
                    hash: 'somehash',
                    updateId: 1,
                  },
                  {
                    name: 'one1file',
                    mimeType: 'text/plain',
                    size: 1,
                    hash: 'somehash',
                    updateId: 1,
                  },
                ],
                userAddress: '0x999',
                updateId: 1,
              },
            ],
            files: [],
            userAddress: '0x999',
            updateId: 1,
          },
        ],
        files: [],
        userAddress: 'someaddress',
        updateId: 1,
      },
    }

    const result = getItem('/0x123', tree.directory)
    assertDirectory(result)
    assertDirectories(result.directories)
    expect(result.directories).toHaveLength(1)
    // inside `one` directory 2 directories
    expect(result.directories[0].directories).toHaveLength(2)
    assertDirectories(result.directories[0].directories)
    // inside `one_one` directory 1 directory
    expect(result.directories[0].directories[0].directories).toHaveLength(1)
    // inside `one_two` directory 1 directory
    expect(result.directories[0].directories[1].directories).toHaveLength(1)
  })
})
