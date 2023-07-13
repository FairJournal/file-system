import { FileSystem } from '../../src'
import { createWallet, fakeRandomBagIDHash } from '../utils'
import { personalSign, personalSignVerify } from '../../src/utils/ton/ton'
import { Update } from '../../src/file-system/update/update'
import { AddFileActionData, createAddFileAction } from '../../src/file-system/update/interfaces/add-file-action'
import { createAddUserAction } from '../../src/file-system/update/interfaces/add-user-action'
import { FS_VERSION } from '../../src/file-system/const'
import { assertDirectories } from '../../src/file-system/directory'
import { assertFiles } from '../../src/file-system/file'
import { assertTree } from '../../src/file-system/interfaces/tree'

describe('File System', () => {
  it('ton cli is available', async () => {
    // const cli = createStorageCli()
    // const list = await cli.list()
    // expect(list.ok).toBeTruthy()
    // expect(list.error).not.toBeDefined()
  })

  it('check personal signature', async () => {
    const publicKey = 'd66401889725ada1f6ba8e78f67d24aec386341d8e3310f00ef64df463def1ef'
    const data = 'Hello world!'
    // signature created using Openmask
    const signature =
      'efb732d1d06d12c7dc9d9e59aebf8bb3c03f081806f3e31cfe26a2263db9cd840b47bb70f915bb06f601d54ec75263f9b0e31ec0fde70ea11a0f2a2c9725200c'
    expect(personalSignVerify(data, signature, publicKey)).toBeTruthy()
  })

  it('create tree with updates', async () => {
    const PROJECT_NAME = 'Test'
    const PROJECT_DESCRIPTION = 'The most amazing project in the world'
    const authors = await Promise.all(
      Array.from({ length: 3 }, async () => {
        const wallet = await createWallet()

        return {
          address: wallet.publicKey.toString('hex'),
          personalSign: (data: string) => personalSign(data, wallet.secretKey),
        }
      }),
    )
    const cachedReferences: { [key: number]: string } = {}

    const fs = new FileSystem({
      version: FS_VERSION,
      projectName: PROJECT_NAME,
      projectDescription: PROJECT_DESCRIPTION,
      checkSignature: 'ton',
    })

    // add users
    for (const author of authors) {
      const update = new Update(PROJECT_NAME, author.address, 1)
      expect(fs.getUpdateId(author.address)).toEqual(0)
      update.addAction(createAddUserAction(author.address))
      update.setSignature(author.personalSign(update.getSignData()))
      fs.addUpdate(update.getUpdateDataSigned())
      expect(fs.getUpdateId(author.address)).toEqual(1)
    }

    const file1Name = 'file'
    const file1Info: AddFileActionData = {
      path: `/${file1Name}`,
      mimeType: 'text/plain',
      size: 1,
      hash: fakeRandomBagIDHash(),
    }
    const update2 = new Update(PROJECT_NAME, authors[0].address, 2)
    update2.addAction(createAddFileAction(file1Info))
    update2.setSignature(authors[0].personalSign(update2.getSignData()))

    fs.addUpdate(update2.getUpdateDataSigned())

    expect(fs.getUpdateId(authors[0].address)).toEqual(2)
    expect(() => fs.addUpdate(update2.getUpdateDataSigned())).toThrowError('Update with id "2" already exists')
    expect(fs.getUpdateId(authors[0].address)).toEqual(2)

    expect(fs.getPathInfo(`/${authors[0].address}/file`)).toEqual({
      hash: file1Info.hash,
      mimeType: file1Info.mimeType,
      name: file1Name,
      size: file1Info.size,
      updateId: 2,
    })

    const meta = fs.exportMeta()
    // ["directory"]
    expect(Object.keys(meta.tree)).toHaveLength(1)
    expect(meta.users).toHaveLength(3)
    // 3 directories in the root directory for 3 users
    assertTree(meta.tree)
    expect(meta.tree.directory.directories).toHaveLength(3)
    // no files in the root directory
    expect(meta.tree.directory.files).toHaveLength(0)
    assertDirectories(meta.tree.directory.directories)
    const authorDirectory = meta.tree.directory.directories.find(item => item.name === authors[0].address)

    if (!authorDirectory) {
      throw new Error('Author directory not found')
    }

    expect(authorDirectory).toBeDefined()
    expect(authorDirectory.files).toHaveLength(1)
    assertFiles(authorDirectory.files)
    const file1 = authorDirectory.files[0]
    expect(file1.name).toEqual(file1Name)

    const dataBeforeUpload = fs.exportMeta()
    let counter = 0
    const uploadResult = await fs.upload({
      uploadData: async data => {
        counter++
        cachedReferences[counter] = data

        return {
          reference: counter.toString(),
        }
      },
    })
    const dataAfterUpload = fs.exportMeta()

    // check that meta not changed after upload
    expect(dataBeforeUpload).toEqual(dataAfterUpload)

    // 3 - upload of 3 users root directories
    // 3 - upload of 3 user's updates
    // 1 - upload root directories combined
    // 1 - upload root files combined
    // 1 - upload packed tree
    // 1 - upload packed updates
    // 1 - upload packed users
    // 1 - upload user mapping
    // 1 - upload packed meta (final)
    expect(uploadResult).toEqual({ reference: '13' })

    const newFs = new FileSystem({
      version: FS_VERSION,
      projectName: PROJECT_NAME,
      projectDescription: PROJECT_DESCRIPTION,
      checkSignature: 'ton',
    })
    let downloadTimes = 0
    await newFs.download(uploadResult.reference, {
      downloadData: async data => {
        downloadTimes++
        const id = Number(data.reference)

        if (!cachedReferences[id]) {
          throw new Error(`Reference "${id}" not found`)
        }

        return cachedReferences[id]
      },
      withUpdates: true,
    })

    // 1 - download packed meta
    // 1 - download user mapping
    // 1 - download packed users
    // 1 - download packed updates
    // 1 - download packed tree
    // 1 - upload root files combined
    // 1 - upload root directories combined
    // 3 - upload of 3 users root directories
    // 3 - upload of 3 user's updates

    expect(downloadTimes).toEqual(13)
    expect(fs.exportMeta()).toEqual(newFs.exportMeta())
    expect(fs).toStrictEqual(newFs)
  })
})
