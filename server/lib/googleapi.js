const { google } = require("googleapis");
const fs = require("fs");
const mime = require("mime-types");

const FOLDER_MAP = {
  screenshot: process.env.SCREEN_SHOT_FOLDER,
  recording: process.env.RECORDING_FOLDER,
  books: process.env.BOOKS_FOLDER,
  application: process.env.APPLICATION_FOLDER,
};

/**
 * Upload a file to Google Drive and make it public
 * @param {string} filePath - Local path to file
 * @param {"screenshot"|"recording"|"books"} folderType - Drive folder type
 * @param {string} customName - Optional custom name for Drive file
 * @returns {Promise<{id: string, webViewLink: string, src: string}>}
 */
async function uploadFile(filePath, folderType, customName) {
  if (!FOLDER_MAP[folderType]) {
    throw new Error(
      `Invalid folder type "${folderType}". Choose from: ${Object.keys(
        FOLDER_MAP
      ).join(", ")}`
    );
  }

  const { google } = require("googleapis");
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const fileName = customName || filePath.split("/").pop();
  const mimeType = mime.lookup(filePath) || "application/octet-stream";

  // Upload the file
  const fileMetadata = {
    name: fileName,
    parents: [FOLDER_MAP[folderType]],
  };

  const media = {
    mimeType,
    body: fs.createReadStream(filePath),
  };

  console.log(`🔹 Uploading file: ${fileName} to folder: ${folderType}`);

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id, name, webViewLink",
  });

  const fileId = response.data.id;

  // Make file public
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  // Get webContentLink
  const { data } = await drive.files.get({
    fileId,
    fields: "id, webViewLink, webContentLink",
  });

  console.log("✅ File uploaded and made public!");
  console.log("📄 File name:", data.name);
  console.log("🔗 Web view link:", data.webViewLink);
  console.log("🖼️ Direct src link:", data.webContentLink);

  return {
    id: data.id,
    webViewLink: data.webViewLink,
    src: data.webContentLink,
  };
}

module.exports = { uploadFile };
