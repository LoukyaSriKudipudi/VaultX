const {
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

/**
 * Uploads a file buffer to S3
 * @param {Object} file - Multer file object (memoryStorage)
 * @returns {Object} uploaded file info
 */
async function uploadFile(file) {
  if (!file || !file.buffer) throw new Error("File buffer is missing");

  const key = `uploads/${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  return {
    key,
    filename: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  };
}

/**
 * Generates a temporary signed URL for viewing/downloading the file
 * @param {string} key - S3 object key
 * @param {number} expiresIn - expiration time in seconds (default 300)
 * @returns {string} signed URL
 */
async function getFileUrl(key, expiresIn = 300) {
  if (!key) throw new Error("S3 key is required for signed URL");

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: "attachment",
  });

  return getSignedUrl(s3, command, { expiresIn });
}

/**
 * Deletes a file from S3
 * @param {string} key - S3 object key
 */
async function deleteFile(key) {
  if (!key) return;

  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    await s3.send(command);
  } catch (err) {
    console.error("Failed to delete S3 object:", key, err);
  }
}

module.exports = { uploadFile, getFileUrl, deleteFile };
