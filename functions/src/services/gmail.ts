import * as functions from 'firebase-functions';
import { google } from 'googleapis';
import { db, collections, timestampToDate } from './db';

const OAuth2 = google.auth.OAuth2;

// Gmail API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/userinfo.email',
];

class GmailService {
  private oauth2Client: any;

  constructor() {
    const clientId = functions.config().gmail?.client_id || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = functions.config().gmail?.client_secret || process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = functions.config().gmail?.redirect_uri || process.env.GOOGLE_REDIRECT_URI || 'https://us-central1-cleveland-lgbtq-center.cloudfunctions.net/api/gmail/callback';

    this.oauth2Client = new OAuth2(clientId, clientSecret, redirectUri);
  }

  /**
   * Generate OAuth URL for Gmail authorization
   */
  getAuthUrl(userId: string): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
      state: userId,
    });
  }

  /**
   * Handle OAuth callback and store tokens
   */
  async handleCallback(code: string, userId: string): Promise<{ email: string }> {
    const { tokens } = await this.oauth2Client.getToken(code);
    
    if (!tokens.refresh_token) {
      throw new Error('No refresh token received. Please revoke access and try again.');
    }

    // Get user email
    this.oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ auth: this.oauth2Client, version: 'v2' });
    const userInfo = await oauth2.userinfo.get();
    const email = userInfo.data.email;

    if (!email) {
      throw new Error('Could not retrieve email from Google');
    }

    // Store tokens in Firestore
    await collections.gmailTokens.doc(userId).set({
      userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
      email,
      updatedAt: new Date(),
    });

    // Update settings
    await collections.settings.doc(userId).update({
      gmailConnected: true,
      gmailEmail: email,
      updatedAt: new Date(),
    });

    return { email };
  }

  /**
   * Check if Gmail is connected for user
   */
  async isConnected(userId: string): Promise<{ connected: boolean; email?: string }> {
    const doc = await collections.gmailTokens.doc(userId).get();
    
    if (!doc.exists) {
      return { connected: false };
    }

    const data = doc.data();
    return { 
      connected: true, 
      email: data?.email 
    };
  }

  /**
   * Get stored refresh token
   */
  async getRefreshToken(userId: string): Promise<string | null> {
    const doc = await collections.gmailTokens.doc(userId).get();
    
    if (!doc.exists) {
      return null;
    }

    return doc.data()?.refreshToken || null;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(userId: string): Promise<string> {
    const refreshToken = await this.getRefreshToken(userId);
    
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    this.oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const { credentials } = await this.oauth2Client.refreshAccessToken();
    
    // Update stored access token
    await collections.gmailTokens.doc(userId).update({
      accessToken: credentials.access_token,
      expiryDate: credentials.expiry_date,
      updatedAt: new Date(),
    });

    return credentials.access_token;
  }

  /**
   * Send email using Gmail API
   */
  async sendEmail(userId: string, options: {
    to: string;
    subject: string;
    body: string;
    isHtml?: boolean;
  }): Promise<{ messageId: string }> {
    const { to, subject, body, isHtml = true } = options;

    // Get fresh access token
    const accessToken = await this.refreshAccessToken(userId);
    this.oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ auth: this.oauth2Client, version: 'v1' });

    // Build email
    const emailContent = [
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      isHtml ? body : body.replace(/\n/g, '<br>'),
    ].join('\n');

    const encodedEmail = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    });

    return { messageId: result.data.id || '' };
  }

  /**
   * Disconnect Gmail and clear tokens
   */
  async disconnect(userId: string): Promise<void> {
    await collections.gmailTokens.doc(userId).delete();
    
    await collections.settings.doc(userId).update({
      gmailConnected: false,
      gmailEmail: null,
      updatedAt: new Date(),
    });
  }
}

export const gmailService = new GmailService();
