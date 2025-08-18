const crypto = require("crypto");

// derive a 32-byte key using scrypt for AES-256
function getKey(secret) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(secret, "vault-salt", 32, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

// Encrypt a value
async function encryptValue(value, secret) {
  const key = await getKey(secret);
  const iv = crypto.randomBytes(16); // 16 bytes IV
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return iv.toString("hex") + ":" + authTag + ":" + encrypted;
}

// Decrypt a value
async function decryptValue(encryptedValue, secret) {
  const key = await getKey(secret);
  const [ivHex, authTagHex, encryptedText] = encryptedValue.split(":");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = { encryptValue, decryptValue };
