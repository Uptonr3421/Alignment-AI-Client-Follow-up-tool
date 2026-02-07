import { google } from 'googleapis';
import { decryptToken } from './encryption';

interface GmailToken {
  accessToken: string;
  refreshToken?: string;
  expiryDate: number;
  scope: string;
}

interface EmailOptions {
  to: string;
  from: string;
  fromName: string;
  replyTo: string;
  subject: string;
  body: string;
  signature?: string;
}

/**
 * Initialize Gmail API client with user's OAuth credentials
 */
export async function createGmailClient(encryptedToken: any) {
  const token = await decryptToken(encryptedToken);
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  
  oauth2Client.setCredentials({
    access_token: token.accessToken,
    refresh_token: token.refreshToken,
    expiry_date: token.expiryDate,
  });
  
  // Refresh token if expired
  if (Date.now() > token.expiryDate) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
  }
  
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

/**
 * Send email via Gmail API
 */
export async function sendEmail(
  gmail: any,
  options: EmailOptions
): Promise<{ id: string; threadId: string }> {
  const { to, from, fromName, replyTo, subject, body, signature } = options;
  
  // Construct email content
  const emailLines = [
    `To: ${to}`,
    `From: "${fromName}" <${from}>`,
    `Reply-To: ${replyTo}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    body,
  ];
  
  if (signature) {
    emailLines.push('', '--', signature);
  }
  
  const emailContent = emailLines.join('\n');
  
  // Base64url encode
  const encodedEmail = Buffer.from(emailContent)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  // Send via Gmail API
  const response = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedEmail,
    },
  });
  
  return {
    id: response.data.id,
    threadId: response.data.threadId,
  };
}

/**
 * Verify Gmail token is valid
 */
export async function verifyToken(gmail: any): Promise<boolean> {
  try {
    await gmail.users.getProfile({ userId: 'me' });
    return true;
  } catch (error) {
    return false;
  }
}
