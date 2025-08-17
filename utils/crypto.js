const crypto = require("crypto");

// Prepare a 16-byte key from your secret (AES-128 requires 16 bytes)
const SECRET_KEY = crypto
  .createHash("sha256") // generates 32-byte hash
  .update(process.env.CRYPTO_SECRET)
  .digest()
  .subarray(0, 16); // take first 16 bytes for AES-128

// Encrypt a value
function encryptValue(value) {
  const iv = crypto.randomBytes(16); // 16 bytes IV
  const cipher = crypto.createCipheriv("aes-128-gcm", SECRET_KEY, iv);

  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  // Store iv + authTag + ciphertext, separated by :
  return iv.toString("hex") + ":" + authTag + ":" + encrypted;
}

// Decrypt a value
function decryptValue(encryptedValue) {
  const [ivHex, authTagHex, encryptedText] = encryptedValue.split(":");

  const decipher = crypto.createDecipheriv(
    "aes-128-gcm",
    SECRET_KEY,
    Buffer.from(ivHex, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = {
  encryptValue,
  decryptValue,
};
