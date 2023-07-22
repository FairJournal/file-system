import { AddFileActionData, createAddFileAction, createAddUserAction, FileSystem, Update } from '../../src'
import { createAddDirectoryAction } from '../../src/file-system/update/interfaces/add-directory-action'
import { createRemoveDirectoryAction } from '../../src/file-system/update/interfaces/remove-directory-action'
import { FS_VERSION } from '../../src/file-system/const'
import { createWallet, fakeRandomBagIDHash } from '../utils'
import { personalSign } from '../../src'

const PROJECT_NAME = 'Test'
const PROJECT_DESCRIPTION = 'The most amazing project in the world'

describe('Remove directory', () => {
  it('creates directory with a file and remove it', async () => {
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

    // Create a directory
    const directoryPath = '/myDirectory'
    const fullDirectoryPath = `/${author.address}${directoryPath}`
    update = new Update(PROJECT_NAME, author.address, 2)
    update.addAction(createAddDirectoryAction(directoryPath))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())
    const directoryInfo = fileSystem.getPathInfo(fullDirectoryPath)
    expect(directoryInfo).toBeTruthy()

    // Add a file inside the directory
    const fileInformation: AddFileActionData = {
      path: `${directoryPath}/file`,
      mimeType: 'text/plain',
      size: 1,
      hash: fakeRandomBagIDHash(),
    }
    update = new Update(PROJECT_NAME, author.address, 3)
    update.addAction(createAddFileAction(fileInformation))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    const fullFilePath = `/${author.address}${fileInformation.path}`
    const fileInfo = fileSystem.getPathInfo(fullFilePath)
    expect(fileInfo).toBeTruthy()

    // Now remove the directory
    update = new Update(PROJECT_NAME, author.address, 4)
    update.addAction(createRemoveDirectoryAction(directoryPath))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    // Check that directory and file inside no longer exist
    const dirName = directoryPath.split('/').pop()
    expect(() => fileSystem.getPathInfo(fullDirectoryPath)).toThrowError(`Get item: item not found: "${dirName}"`)
    expect(() => fileSystem.getPathInfo(fullFilePath)).toThrowError(`Get item: item not found: "${dirName}"`)
  })

  it('attempts to remove root directory and fails', async () => {
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

    // Attempt to remove root directory
    update = new Update(PROJECT_NAME, author.address, 2)
    update.addAction(createRemoveDirectoryAction('/'))
    update.setSignature(author.personalSign(update.getSignData()))

    expect(() => fileSystem.addUpdate(update.getUpdateDataSigned())).toThrowError(
      'Path should be absolute and contain at least one component',
    )
  })

  it('creates an empty directory and removes it successfully', async () => {
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

    // Create an empty directory
    const directoryPath = '/emptyDirectory'
    const fullDirectoryPath = `/${author.address}${directoryPath}`
    update = new Update(PROJECT_NAME, author.address, 2)
    update.addAction(createAddDirectoryAction(directoryPath))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    const directoryInfo = fileSystem.getPathInfo(fullDirectoryPath)
    expect(directoryInfo).toBeTruthy()

    // Now remove the empty directory
    update = new Update(PROJECT_NAME, author.address, 3)
    update.addAction(createRemoveDirectoryAction(directoryPath))
    update.setSignature(author.personalSign(update.getSignData()))
    fileSystem.addUpdate(update.getUpdateDataSigned())

    // Check that directory no longer exist
    const dirName = directoryPath.split('/').pop()
    expect(() => fileSystem.getPathInfo(fullDirectoryPath)).toThrowError(`Get item: item not found: "${dirName}"`)
  })
})
