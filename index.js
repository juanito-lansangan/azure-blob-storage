import "regenerator-runtime/runtime";
require("dotenv").config();
const { BlobServiceClient } = require("@azure/storage-blob");
const selectButton = document.getElementById("select-button");
const fileInput = document.getElementById("file-input");

const containerName = "docs";
const blobSasUrl = process.env.BLOB_SAS_URL;
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const containerClient = blobServiceClient.getContainerClient(containerName);

const uploadFiles = async () => {
  try {
    const promises = [];
    for (const file of fileInput.files) {
      const blobBlobClient = containerClient.getBlockBlobClient(file.name);
      promises.push(blobBlobClient.uploadBrowserData(file));
    }
    await Promise.all(promises);
  } catch (error) {
    alert(error.message);
  }
};

selectButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", uploadFiles);
