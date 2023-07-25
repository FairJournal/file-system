# Mutable File System on top of Immutable Storages

This Typescript library creates a public virtual file system for data sharing, compatible with decentralized storages like IPFS, TON Storage, Torrent, Arweave or Swarm. It allows users to control their data, storing various content types (videos, photos, text) in their own file systems. Files systems, once combined, form a decentralized social network like an uncensored Reddit, YouTube or Medium. Public gateways manage data, with cryptographic signatures ensuring no alterations. A unique feature economizes smart contract changes by aggregating them into a single hash, saved at regular intervals, protecting by users' crypto wallets.

## Features

**Library Features:**

1. **Decentralized Storage Compatibility:** It works with multiple decentralized storage systems including IPFS, TON Storage, Torrent, Arweave, and Swarm.

2. **Public File System:** Users can create a public file system, which is accessible online for data sharing.

3. **Fixed Reference Length:** The reference to the structure of the file system (set of directories and files) has a fixed length of 64 characters.

4. **User Control Over Data:** Allows users to store different types of content (video, photos, text, etc.) in their file system.

5. **Cryptographic Security:** Each file structure update is signed cryptographically, ensuring no unauthorized changes can be made.

6. **User Action Verification:** When building a person's file structure, all their actions can and should be checked by others to ensure the actions were actually performed by that person.

7. **No Personal Storage Node Required:** Users can manage their data through public gateways without needing to have their own storage node.

**[Backend](https://github.com/FairJournal/backend) Features:**

The backend serves as a Mempool, Gateway, and Rollup. Here's the function of each component:

1. **Mempool:** It holds user operations on their file systems before they are included in the smart contract and uploaded to storage.

2. **Gateway:** It manages data uploads to storage via public gateways, negating the need for users to install nodes/extensions. This component can be replaced in projects that use other file gateways.

3. **Rollup:** It aggregates all user changes over a specified period into a single hash. This hash is then stored in a smart contract at regular intervals (e.g., every minute/hour/day). This approach significantly reduces the typically high costs associated with smart contract modifications, potentially saving users thousands of dollars.

4. **Appchains:** By combining the backend and file system components, services can build Appchains for data storage. As the project evolves, these data Appchains will be interconnected in a decentralized manner, further enhancing the system's robustness and scalability.

The backend is designed to enable users to leverage decentralized technologies without installing complex software.


## Installation

`npm i @fairjournal/file-system`

Using

```typescript
import { FileSystem, Update, createAddUserAction, createAddDirAction, AddFileActionData, createAddFileAction, createRemoveFileAction, createRemoveDirAction } from '@fairjournal/file-system'

const PROJECT_NAME = 'decentralized-social-network'
const PROJECT_DESCRIPTION = 'The best project in the world'

// Creating a FileSystem instance
// It can be created on the user's machine or on a gateway
const fs = new FileSystem({
  version: '0.0.1',
  projectName: PROJECT_NAME,
  projectDescription: PROJECT_DESCRIPTION,

  // `checkSignature` is used to verify the signature. You should pass here 
  // the supported signature as a string or a function that can handle signature verification.
  // If you pass a string, the built-in function for that type of signature will be used.
  // If you pass a function, it will be used as a custom signature verification function.
  checkSignature: 'ton',
})

const author = {
  // address/public key of the author
  author: '0x....',

  // signing method
  personalSign: (data: string) => {
    // sign data using a wallet or a private key of the user
  }
}

// Creating an update instance
let update = new Update(PROJECT_NAME, author.address, 1)

// Registering the author's FileSystem
update.addAction(createAddUserAction(author.address))

// Signing all changes to the user's FileSystem
update.setSignature(author.personalSign(update.getSignData()))

// Applying the update
fs.addUpdate(update.getUpdateDataSigned())

// Creating a directory
update = new Update(PROJECT_NAME, author.address, 2)
update.addAction(createAddDirAction('/my-dir'))

// Signing the update
update.setSignature(author.personalSign(update.getSignData()))

// Applying the update
fs.addUpdate(update.getUpdateDataSigned())

const fileInformation: AddFileActionData = {
  path: '/my-dir/my-file',
  mimeType: 'application/json',
  size: 13,
  hash: 'c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a',
}

// Adding a file to the directory
update = new Update(PROJECT_NAME, author.address, 3)
update.addAction(createAddFileAction(fileInformation))

// Signing the update
update.setSignature(author.personalSign(update.getSignData()))

// Applying the update
fs.addUpdate(update.getUpdateDataSigned())

// Removing a file
update = new Update(PROJECT_NAME, author.address, 4)
update.addAction(createRemoveFileAction('/my-dir/my-file'))

// Signing the update
update.setSignature(author.personalSign(update.getSignData()))

// Applying the update
fs.addUpdate(update.getUpdateDataSigned())

// Removing a directory
update = new Update(PROJECT_NAME, author.address, 5)
update.addAction(createRemoveDirAction('/my-dir'))

// Signing the update
update.setSignature(author.personalSign(update.getSignData()))

// Applying the update
fs.addUpdate(update.getUpdateDataSigned())

// Uploading FileSystem data to the network
const uploadResult = await fs.upload({
  uploadData: async data => {
    // Here you would handle uploading the data to your network (IPFS, TON Storage, Torrent, Arweave, Swarm and etc),
    // And return an identifier/reference to where the data has been uploaded
    return { reference: 'your-upload-reference' }
  }
})

// Downloading FileSystem data from the network
const newFs = new FileSystem({
  version: '0.0.1',
  projectName: PROJECT_NAME,
  projectDescription: PROJECT_DESCRIPTION,
  checkSignature: 'ton',
})
await newFs.download(uploadResult.reference, {
  downloadData: async data => {
    // Here you would handle fetching the data from your network using the provided reference
    return 'your-downloaded-data'
  },
  withUpdates: true,
})
```
