const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

// Load the .env file if it exists
require("dotenv").config();

const upload = async (data) => {
  // Enter your storage account name and shared key
  const account = process.env.ACCOUNT_NAME || "";
  const accountKey = process.env.ACCOUNT_KEY || "";

  // Use StorageSharedKeyCredential with storage account and account key
  // StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
  const sharedKeyCredential = new StorageSharedKeyCredential(
    account,
    accountKey
  );

  // List containers
  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
  );

  // Create a container
  // const containerName = "docs";
  const containerClient = blobServiceClient.getContainerClient(
    data.environment
  );

  await containerClient.createIfNotExists({
    access: "container",
  });
  console.log(`Create container ${data.environment} successfully`);

  const promises = [];
  for (const file of data.files) {
    const blockBlobClient = containerClient.getBlockBlobClient(
      `${data.processor}/${data.holderId}/${file.name}`
    );
    // const matches = file.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    // const buffer = new Buffer(matches[2], "base64");

    const buffer = new Buffer(file.image, "base64");

    promises.push(blockBlobClient.upload(buffer, buffer.byteLength));
  }

  await Promise.all(promises);
};

module.exports = { upload };
