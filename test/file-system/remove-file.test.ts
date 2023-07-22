import { AddFileActionData, createAddFileAction, createAddUserAction, FileSystem, Update } from '../../src'
import { FS_VERSION } from '../../src/file-system/const'
import { createWallet, fakeRandomBagIDHash } from '../utils'
import { personalSign } from '../../src'
import { createRemoveFileAction } from '../../src/file-system/update/interfaces/remove-file-action'

const PROJECT_NAME = 'Test'
const PROJECT_DESCRIPTION = 'The most amazing project in the world'

describe('Remove file', () => {
  it('creates a file and removes it', async () => {
    const wallet = await createWallet()
    const author = {
      address: wallet.publicKey.toString('hex'),
      personalSign: (data: string) => personalSign(data, wallet.secretKey),
    }

    const fileSystem = new FileSystem({
      version: FS_VERSION,
      projectName: PROJECT_NAME,
      projectDescription: PROJECT_DESCRIPTION,
      checkSignature: 'ton',
    })

    // add user
    let update = new Update(PROJECT_NAME, author.address, 1)
    update.addAction(createAddUserAction(author.address))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    // Add a file
    const filePath = '/myfile'
    const fileInformation: AddFileActionData = {
      path: filePath,
      mimeType: 'text/plain',
      size: 1,
      hash: fakeRandomBagIDHash(),
    }
    update = new Update(PROJECT_NAME, author.address, 2)
    update.addAction(createAddFileAction(fileInformation))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    const fullFilePath = `/${author.address}${fileInformation.path}`
    const fileInfo = fileSystem.getPathInfo(fullFilePath)
    expect(fileInfo).toBeTruthy()

    // Now remove the file
    update = new Update(PROJECT_NAME, author.address, 3)
    update.addAction(createRemoveFileAction(filePath))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    // Check that file no longer exists
    const fileName = filePath.split('/').pop()
    expect(() => fileSystem.getPathInfo(fullFilePath)).toThrowError(`Get item: item not found: "${fileName}"`)
  })

  it('tries to remove an already removed file', async () => {
    const wallet = await createWallet()
    const author = {
      address: wallet.publicKey.toString('hex'),
      personalSign: (data: string) => personalSign(data, wallet.secretKey),
    }

    const fileSystem = new FileSystem({
      version: FS_VERSION,
      projectName: PROJECT_NAME,
      projectDescription: PROJECT_DESCRIPTION,
      checkSignature: 'ton',
    })

    // add user
    let update = new Update(PROJECT_NAME, author.address, 1)
    update.addAction(createAddUserAction(author.address))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    // Create and remove a file
    const filePath = '/myfile'
    const fileInformation: AddFileActionData = {
      path: filePath,
      mimeType: 'text/plain',
      size: 1,
      hash: fakeRandomBagIDHash(),
    }
    update = new Update(PROJECT_NAME, author.address, 2)
    update.addAction(createAddFileAction(fileInformation))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    update = new Update(PROJECT_NAME, author.address, 3)
    update.addAction(createRemoveFileAction(filePath))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    // Try to remove the same file again
    update = new Update(PROJECT_NAME, author.address, 4)
    update.addAction(createRemoveFileAction(filePath))
    update.setSignature(author.personalSign(update.getSignData()))

    expect(() => fileSystem.addUpdate(update.getUpdateDataSigned())).toThrowError(
      `File does not exist: "${filePath.split('/').pop()}"`,
    )
  })

  it('tries to remove a non-existent file', async () => {
    const wallet = await createWallet()
    const author = {
      address: wallet.publicKey.toString('hex'),
      personalSign: (data: string) => personalSign(data, wallet.secretKey),
    }

    const fileSystem = new FileSystem({
      version: FS_VERSION,
      projectName: PROJECT_NAME,
      projectDescription: PROJECT_DESCRIPTION,
      checkSignature: 'ton',
    })

    // add user
    let update = new Update(PROJECT_NAME, author.address, 1)
    update.addAction(createAddUserAction(author.address))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    const nonExistentFilePath = '/nonExistentFile'
    update = new Update(PROJECT_NAME, author.address, 2)
    update.addAction(createRemoveFileAction(nonExistentFilePath))
    update.setSignature(author.personalSign(update.getSignData()))

    expect(() => fileSystem.addUpdate(update.getUpdateDataSigned())).toThrowError(
      `File does not exist: "${nonExistentFilePath.split('/').pop()}"`,
    )
  })

  it('removes multiple files at once', async () => {
    const wallet = await createWallet()
    const author = {
      address: wallet.publicKey.toString('hex'),
      personalSign: (data: string) => personalSign(data, wallet.secretKey),
    }

    const fileSystem = new FileSystem({
      version: FS_VERSION,
      projectName: PROJECT_NAME,
      projectDescription: PROJECT_DESCRIPTION,
      checkSignature: 'ton',
    })

    // add user
    let update = new Update(PROJECT_NAME, author.address, 1)
    update.addAction(createAddUserAction(author.address))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    // Create 10 files
    for (let i = 1; i <= 10; i++) {
      const filePath = `/file${i}`
      const fileInformation: AddFileActionData = {
        path: filePath,
        mimeType: 'text/plain',
        size: 1,
        hash: fakeRandomBagIDHash(),
      }
      update = new Update(PROJECT_NAME, author.address, i + 1)
      update.addAction(createAddFileAction(fileInformation))
      update.setSignature(author.personalSign(update.getSignData()))
      fileSystem.addUpdate(update.getUpdateDataSigned())
    }

    // Remove all 10 files in one go
    update = new Update(PROJECT_NAME, author.address, 12)
    for (let i = 1; i <= 10; i++) {
      const filePath = `/file${i}`
      update.addAction(createRemoveFileAction(filePath))
    }
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    // Check all files are removed
    for (let i = 1; i <= 10; i++) {
      const fullFilePath = `/${author.address}/file${i}`
      expect(() => fileSystem.getPathInfo(fullFilePath)).toThrowError(`Get item: item not found: "file${i}"`)
    }
  })

  it('adds a file, removes it, verifies it is removed, then adds it again and verifies it is added', async () => {
    const wallet = await createWallet()
    const author = {
      address: wallet.publicKey.toString('hex'),
      personalSign: (data: string) => personalSign(data, wallet.secretKey),
    }

    const fileSystem = new FileSystem({
      version: FS_VERSION,
      projectName: PROJECT_NAME,
      projectDescription: PROJECT_DESCRIPTION,
      checkSignature: 'ton',
    })

    // Add user
    let update = new Update(PROJECT_NAME, author.address, 1)
    update.addAction(createAddUserAction(author.address))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    // Add a file
    const filePath = '/myfile'
    const fileInformation: AddFileActionData = {
      path: filePath,
      mimeType: 'text/plain',
      size: 1,
      hash: fakeRandomBagIDHash(),
    }
    update = new Update(PROJECT_NAME, author.address, 2)
    update.addAction(createAddFileAction(fileInformation))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    const fullFilePath = `/${author.address}${fileInformation.path}`
    let fileInfo = fileSystem.getPathInfo(fullFilePath)
    expect(fileInfo).toBeTruthy()

    // Remove the file
    update = new Update(PROJECT_NAME, author.address, 3)
    update.addAction(createRemoveFileAction(filePath))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    // Verify that the file is removed
    const fileName = filePath.split('/').pop()
    expect(() => fileSystem.getPathInfo(fullFilePath)).toThrowError(`Get item: item not found: "${fileName}"`)

    // Add the file again
    update = new Update(PROJECT_NAME, author.address, 4)
    update.addAction(createAddFileAction(fileInformation))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    // Verify that the file is added
    fileInfo = fileSystem.getPathInfo(fullFilePath)
    expect(fileInfo).toBeTruthy()
  })
})
