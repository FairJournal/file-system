import { assertTree, Tree } from './interfaces/tree'
import { Update } from './update/update'
import { isPublicKeyValid, personalSignVerify } from '../utils/ton/ton'
import { assertExportMeta, ExportMeta } from './interfaces/export-meta'
import { ExportMetaOptions } from './interfaces/export-meta-options'
import { DEFAULT_EXPORT_META_OPTIONS, MAX_ACTIONS_PER_UPDATE } from './const'
import { FileSystemOptions } from './interfaces/file-system-options'
import { ActionType } from './update/interfaces/action'
import { AddDirectoryActionData } from './update/interfaces/add-directory-action'
import { addItem, ItemType } from '../utils/path'
import { AddUserActionData } from './update/interfaces/add-user-action'
import { AddFileActionData } from './update/interfaces/add-file-action'
import { UploadOptions } from './interfaces/upload-options'
import { assertUsers, User } from './interfaces/user'
import { assertDirectories, assertDirectory, Directory } from './directory'
import {
  assertUpdateDataSignedArray,
  assertUpdateDataSignedObject,
  UpdateDataSigned,
} from './update/interfaces/update-data-signed'
import { assertJson, assertObject, deepClone } from '../utils/types'
import { DownloadOptions } from './interfaces/download-options'
import { assertFiles } from './file'
import { assertKeyNumberMap } from './interfaces/key-number-map'
import { assertReferencedItem, ReferencedItem } from './interfaces/referenced-item'
import { assertReferencedItems, ReferencedItems } from './interfaces/referenced-items'

/**
 * File System on top of immutable data storage
 */
export class FileSystem {
  private _tree: Tree = {
    directory: {
      name: '/',
      directories: [],
      files: [],
      userAddress: '',
      updateId: 0,
    },
  }

  /**
   * Updates of the file system
   * @private
   */
  private _updates: { [key: string]: UpdateDataSigned[] } = {}

  /**
   * Users of the file system
   * @private
   */
  private _users: User[] = []

  /**
   * Map of updates by user address
   * @private
   */
  private _userUpdateMap: { [key: string]: number } = {}

  constructor(private options: FileSystemOptions) {}

  /**
   * Add directory to the file system
   *
   * @param update Update from the user
   * @param data Data of the update
   * @private
   */
  private addDirectory(update: Update, data: AddDirectoryActionData): void {
    addItem(this._tree.directory, update.getUserAddress(), update.getId(), data, ItemType.Directory)
  }

  /**
   * Add file to the file system
   *
   * @private
   * @param update Update from the user
   * @param data Data of the update
   */
  private addFile(update: Update, data: AddFileActionData): void {
    addItem(this._tree.directory, update.getUserAddress(), update.getId(), data, ItemType.File)
  }

  /**
   * Add user to the file system
   *
   * @param updateId Id of the update
   * @param user User to add
   * @private
   */
  private addUser(updateId: number, user: AddUserActionData): void {
    const address = user.userAddress.toLowerCase()

    if (!isPublicKeyValid(address)) {
      throw new Error(`User address is not valid: ${address}`)
    }

    if (this._users.find(item => item.address.toLowerCase() === address)) {
      throw new Error(`User with address "${address}" already exists`)
    }

    assertDirectories(this._tree.directory.directories)

    if (this._tree.directory.directories.find(item => item.name.toLowerCase() === address)) {
      throw new Error(`Directory with name "${address}" already exists`)
    }

    this._users.push({
      address,
    })
    // add user directory where user can add files and other directories
    this._tree?.directory.directories.push({
      name: address,
      files: [],
      directories: [],
      userAddress: address,
      updateId: updateId,
    })
  }

  /**
   * Checks if user exists
   *
   * @param userAddress Address of the user
   */
  isUserExists(userAddress: string): boolean {
    return this._userUpdateMap[userAddress] !== undefined
  }

  /**
   * Add update to file system
   */
  addUpdate(updateData: UpdateDataSigned): void {
    if (this.options.checkSignature !== 'ton') {
      throw new Error('Not implemented signature check for this type')
    }

    const update = new Update(updateData.projectName, updateData.userAddress, updateData.id)
    update.setActions(updateData.actions)
    update.setSignature(updateData.signature)

    if (update.getActions().length === 0) {
      throw new Error('Update should have at least one action')
    }

    if (update.getActions().length > MAX_ACTIONS_PER_UPDATE) {
      throw new Error(`Update should have max "${MAX_ACTIONS_PER_UPDATE}" actions`)
    }

    if (!update.getSignature()) {
      throw new Error('Update signature is required')
    }

    if (update.projectName !== this.options.projectName) {
      throw new Error(`Project name is not valid. Expected: ${this.options.projectName}`)
    }

    if (update.getId() <= 0) {
      throw new Error('Update id should be greater than 0')
    }

    if (!this._userUpdateMap[update.getUserAddress()]) {
      this._userUpdateMap[update.getUserAddress()] = 0
    }

    if (this._userUpdateMap[update.getUserAddress()] >= update.getId()) {
      throw new Error(`Update with id "${update.getId()}" already exists`)
    }

    if (this._userUpdateMap[update.getUserAddress()] !== update.getId() - 1) {
      throw new Error(
        `Update should be sequential. Expected id is "${this._userUpdateMap[update.getUserAddress()] + 1}"`,
      )
    }

    const signData = update.getSignData()

    if (!signData) {
      throw new Error('Update data is not valid')
    }

    if (!personalSignVerify(signData, update.getSignature(), update.getUserAddress())) {
      throw new Error('Update signature is not valid')
    }

    if (!this._updates[updateData.userAddress]) {
      this._updates[updateData.userAddress] = []
    }

    this._updates[updateData.userAddress].push(updateData)
    this._userUpdateMap[update.getUserAddress()] = update.getId()

    for (const action of update.getActions()) {
      // check that user performs actions only after he was registered
      if (action.actionType !== ActionType.addUser && !this.isUserExists(update.getUserAddress())) {
        throw new Error(`User with address "${update.getUserAddress()}" is not registered. Action can't be performed`)
      }

      if (action.actionType === ActionType.addDirectory) {
        this.addDirectory(update, action.actionData as AddDirectoryActionData)
      } else if (action.actionType === ActionType.addUser) {
        const actionData = action.actionData as AddUserActionData

        if (update.getUserAddress() !== actionData.userAddress) {
          throw new Error('Update user address is not the same as user address from action data')
        }

        this.addUser(update.getId(), actionData)
      } else if (action.actionType === ActionType.addFile) {
        this.addFile(update, action.actionData as AddFileActionData)
      }
    }
  }

  /**
   * Return prepared file system
   */
  exportMeta(options?: ExportMetaOptions): ExportMeta {
    options = options ? options : DEFAULT_EXPORT_META_OPTIONS

    return {
      projectName: this.options.projectName,
      projectDescription: this.options.projectDescription,
      version: this.options.version,
      tree: deepClone(this._tree),
      updates: options.withUpdates ? deepClone(this._updates) : undefined,
      users: options.withUsers ? deepClone(this._users) : undefined,
      userUpdateMap: options.withUserUpdateMap ? deepClone(this._userUpdateMap) : undefined,
    }
  }

  /**
   * Upload file system metadata to the storage
   *
   * @param options Upload options
   */
  async upload(options: UploadOptions): Promise<ReferencedItem> {
    const uploadData = options.uploadData
    const meta = this.exportMeta()
    assertTree(meta.tree)
    assertDirectories(meta.tree.directory.directories)
    assertUsers(meta.users)
    assertObject(meta.updates)
    // const filesCompressed: ReferencedItems = {}
    const directoriesCompressed: ReferencedItems = {}
    const updatesCompressed: ReferencedItems = {}
    for (const user of meta.users) {
      const foundDirectory = meta.tree.directory.directories.find(
        directory => directory.name.toLowerCase() === user.address.toLowerCase(),
      )

      // directory for each user should exist
      if (!foundDirectory) {
        throw new Error(`User directory of user "${user.address}" not found`)
      }

      directoriesCompressed[user.address] = await uploadData(JSON.stringify(foundDirectory))

      // updates for each user is optional
      if (meta.updates?.[user.address]) {
        updatesCompressed[user.address] = await uploadData(JSON.stringify(meta.updates[user.address]))
      }
    }

    // compress root directories (users directories and project's directories)
    meta.tree.directory.directories = await uploadData(JSON.stringify(directoriesCompressed))
    // compress files in root directory (project's files)
    meta.tree.directory.files = await uploadData(JSON.stringify(meta.tree.directory.files))
    meta.tree = await uploadData(JSON.stringify(meta.tree))
    meta.updates = await uploadData(JSON.stringify(updatesCompressed))
    meta.users = await uploadData(JSON.stringify(meta.users))
    meta.userUpdateMap = await uploadData(JSON.stringify(meta.userUpdateMap))

    return uploadData(JSON.stringify(meta))
  }

  /**
   * Download file system metadata from the storage
   *
   * @param reference Root reference
   * @param options Download options
   */
  async download(reference: string, options: DownloadOptions): Promise<void> {
    // 1 - download packed meta
    const downloadData = options.downloadData
    const metaString = await downloadData({ reference })
    assertJson(metaString)
    const metaObject = JSON.parse(metaString) as ExportMeta
    assertExportMeta(metaObject)

    // 1 - download packed users
    assertReferencedItem(metaObject.users)
    const usersString = await downloadData({ reference: metaObject.users.reference })
    assertJson(usersString)
    const usersJson = JSON.parse(usersString)
    assertUsers(usersJson)
    metaObject.users = usersJson

    // 1 - download packed userUpdateMap
    assertReferencedItem(metaObject.userUpdateMap)
    const userUpdateMapString = await downloadData({ reference: metaObject.userUpdateMap.reference })
    assertJson(userUpdateMapString)
    const userUpdateMapObject = JSON.parse(userUpdateMapString)
    assertObject(userUpdateMapObject)
    assertKeyNumberMap(userUpdateMapObject)
    metaObject.userUpdateMap = userUpdateMapObject

    if (options.withUpdates) {
      const updates: { [key: string]: UpdateDataSigned[] } = {}
      assertReferencedItem(metaObject.updates)
      // 1 - download packed updates
      // reference of the updates resolved to the object User->Reference
      const updatesReferenceString = await downloadData({ reference: metaObject.updates.reference })
      assertJson(updatesReferenceString)
      const updatesJson = JSON.parse(updatesReferenceString)
      assertReferencedItems(updatesJson)
      metaObject.updates = updatesJson
      // N - download of N user's updates
      // each reference of a user resolved to the `UpdateDataSigned[]`
      for (const user of metaObject.users) {
        const userUpdates = await downloadData({ reference: metaObject.updates[user.address].reference })
        assertJson(userUpdates)
        const updatesObject = JSON.parse(userUpdates) as UpdateDataSigned[]
        assertUpdateDataSignedArray(updatesObject)
        updates[user.address] = updatesObject
      }

      metaObject.updates = updates
    }

    // 1 - download packed tree
    assertReferencedItem(metaObject.tree)
    const treeString = await downloadData({ reference: metaObject.tree.reference })
    assertJson(treeString)
    const treeObject = JSON.parse(treeString)
    assertTree(treeObject)
    assertReferencedItem(treeObject.directory.directories)
    const rootDirectoryString = await downloadData({ reference: treeObject.directory.directories.reference })
    assertJson(rootDirectoryString)
    const rootDirectoryObject = JSON.parse(rootDirectoryString)
    assertReferencedItems(rootDirectoryObject)

    // download user's root directories
    const downloadedRootDirectories: Directory[] = []
    for (const rootDirectoryKey of Object.keys(rootDirectoryObject)) {
      const directoryString = await downloadData({ reference: rootDirectoryObject[rootDirectoryKey].reference })
      assertJson(directoryString)
      const directoryObject = JSON.parse(directoryString)
      assertDirectory(directoryObject)
      downloadedRootDirectories.push(directoryObject)
    }

    treeObject.directory.directories = downloadedRootDirectories

    // download project's root files info
    assertReferencedItem(treeObject.directory.files)
    const rootFilesString = await downloadData({ reference: treeObject.directory.files.reference })
    assertJson(rootFilesString)
    const rootFilesObject = JSON.parse(rootFilesString)
    assertFiles(rootFilesObject)
    treeObject.directory.files = rootFilesObject
    this._tree = treeObject
    this._users = metaObject.users
    assertUpdateDataSignedObject(metaObject.updates)
    this._updates = metaObject.updates
    this._userUpdateMap = metaObject.userUpdateMap
  }
}
