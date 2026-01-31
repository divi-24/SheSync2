/**
 * Encryption Utility
 * AES-256-CBC symmetric encryption for sensitive context fields.
 * Key is derived from process.env.ENCRYPTION_SECRET (must be 32 bytes when utf-8 encoded).
 * IV is randomly generated per encryption and prepended (hex) to the ciphertext.
 *
 * SECURITY NOTES:
 * - Ensure ENCRYPTION_SECRET is strong (32+ random chars) and rotated periodically.
 * - Do NOT log plaintext sensitive values.
 * - This module is sync for simplicity; for high throughput, consider streaming.
 */
import crypto from 'crypto';

const ALGO = 'aes-256-cbc';
const KEY = (() => {
    const raw = process.env.ENCRYPTION_SECRET || '';
    if (raw.length < 32) {
        console.warn('[encryptor] ENCRYPTION_SECRET is shorter than 32 chars. Padding (DEV ONLY).');
    }
    return crypto.createHash('sha256').update(raw).digest().subarray(0, 32);
})();

function encrypt(plainText) {
    if (plainText === undefined || plainText === null) return null;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGO, KEY, iv);
    let encrypted = cipher.update(String(plainText), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // store iv + ciphertext
}

function decrypt(payload) {
    if (!payload || typeof payload !== 'string') return null;
    const [ivHex, cipherHex] = payload.split(':');
    if (!ivHex || !cipherHex) return null;
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
    let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export { encrypt, decrypt };
export default { encrypt, decrypt };
