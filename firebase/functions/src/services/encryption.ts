import * as crypto from 'crypto';
import * as functions from 'firebase-functions';

// Get encryption key from environment variables
const ENCRYPTION_KEY = functions.config().encryption?.key || process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiryDate: number;
  scope: string;
}

interface EncryptedToken {
  encrypted: string;
  iv: string;
  tag: string;
}

/**
 * Encrypt sensitive token data before storing in Firestore
 */
export async function encryptToken(token: TokenData): Promise<EncryptedToken> {
  if (!ENCRYPTION_KEY) {
    throw new Error('Encryption key not configured');
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  
  let encrypted = cipher.update(JSON.stringify(token), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  };
}

/**
 * Decrypt token data retrieved from Firestore
 */
export async function decryptToken(encryptedToken: EncryptedToken): Promise<TokenData> {
  if (!ENCRYPTION_KEY) {
    throw new Error('Encryption key not configured');
  }

  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
  decipher.setAuthTag(Buffer.from(encryptedToken.tag, 'hex'));
  
  let decrypted = decipher.update(encryptedToken.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return JSON.parse(decrypted);
}

/**
 * Simple hash for non-sensitive data
 */
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}
