# File System on top of Immutable Storages

This Typescript library creates a public virtual file system for data sharing, compatible with decentralized storages like IPFS, TON Storage, Torrent, Arweave or Swarm. It allows users to control their data, storing various content types (videos, photos, text) in their own file systems. Files systems, once combined, form a decentralized social network like an uncensored Reddit, YouTube or Medium. Public gateways manage data, with cryptographic signatures ensuring no alterations. A unique feature economizes smart contract changes by aggregating them into a single hash, saved at regular intervals, protecting by users' crypto wallets.

## Features

Sure, here are the features of the library and backend:

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

The backend is designed to enable users to leverage decentralized technologies without installing complex and security-intensive software.


## Installation

`npm i @fairjournal/file-system`

Using

```typescript
import { FileSystem, AddFileActionData, createAddUserAction } from '@fairjournal/file-system'

// creating file system instance
// it can be created on the user's maching or on a gateway
const fs = new FileSystem({
  version: '0.0.1',
  projectName: 'hello-world',
  projectDescription: 'The best project in the world',
  checkSignature: 'your-project',
})

const fileInfo = {
  // path on the virtual file system
  path: `/my-file`,
  
  // mime type of the data
  mimeType: 'application/json',
  
  // data to upload
  data: 'Hello world!',
  
  // sha-256 hash of the data
  hash: 'c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a'
}

const author = {
  // address/public key of the author
  author: '0x....',
  
  // signing method. it can be called externally using browser extions, for example
  personalSign: (data: string) => {
    // sign data using a wallet or a private key of the user
  }
}

// registering the author's file system
update.addAction(createAddUserAction(author.address))

// adding file to the file system
update.addAction(
  createAddFileAction({
    path: fileInfo.path,
    mimeType: fileInfo.mimeType,
    size: fileInfo.data.length,
    hash: fileInfo.hash,
  }),
)

// signing all changes to the user's file system
update.setSignature(author.personalSign(update.getSignData()))

// getting data of the update with the signature
const dataToShare = update.getUpdateDataSigned()

// this data can be shared with a gateway
// after applying the data, it will become available to other users via Mempool
fs.addUpdate(dataToShare)
```
