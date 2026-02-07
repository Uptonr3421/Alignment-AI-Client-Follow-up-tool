import { google } from 'googleapis';
import { db } from '../db';
import { settings } from '../db/schema';
import { eq } from 'drizzle-orm';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/userinfo.email',
];

export interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
  accessToken: string;
}

export class GmailService {
  /**
   * Generate Google OAuth URL for user consent
   */
  initiateAuth(): string {
    console.log('[GmailService] Generating OAuth URL...');

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
    });

    console.log('[GmailService] OAuth URL generated successfully');
    return authUrl;
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   */
  async handleCallback(code: string): Promise<{ email: string; refreshToken: string }> {
    console.log('[GmailService] Exchanging code for tokens...');

    try {
      const { tokens } = await oauth2Client.getToken(code);
      console.log('[GmailService] Tokens received from Google');

      if (!tokens.refresh_token) {
        throw new Error('No refresh token received. User may need to revoke access and re-authenticate.');
      }

      // Set credentials to fetch user info
      oauth2Client.setCredentials(tokens);

      // Get user email
      const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
      const userInfo = await oauth2.userinfo.get();
      const email = userInfo.data.email || '';

      console.log(`[GmailService] Authenticated as: ${email}`);

      // Save refresh token to database
      const [setting] = await db
        .update(settings)
        .set({
          gmail_connected: true,
          gmail_email: email,
          gmail_refresh_token: tokens.refresh_token,
          updated_at: new Date(),
        })
        .where(eq(settings.id, await this.getSettingsId()))
        .returning();

      console.log('[GmailService] Refresh token saved to database');

      return {
        email,
        refreshToken: tokens.refresh_token,
      };
    } catch (error) {
      console.error('[GmailService] Error handling OAuth callback:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using stored refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    console.log('[GmailService] Refreshing access token...');

    try {
      oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      const { credentials } = await oauth2Client.refreshAccessToken();

      if (!credentials.access_token) {
        throw new Error('Failed to refresh access token');
      }

      console.log('[GmailService] Access token refreshed successfully');
      return credentials.access_token;
    } catch (error) {
      console.error('[GmailService] Error refreshing access token:', error);
      throw error;
    }
  }

  /**
   * Send an email using Gmail API
   */
  async sendEmail(options: SendEmailOptions): Promise<{ id: string; threadId: string }> {
    const { to, subject, body, accessToken } = options;

    console.log(`[GmailService] Sending email to: ${to}`);

    try {
      // Create OAuth2 client with access token
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const gmail = google.gmail({ auth, version: 'v1' });

      // Create raw email message
      const messageParts = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        body,
      ];
      const message = messageParts.join('\r\n');

      // Encode to base64url
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send email
      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      console.log(`[GmailService] Email sent successfully: ${response.data.id}`);

      return {
        id: response.data.id || '',
        threadId: response.data.threadId || '',
      };
    } catch (error) {
      console.error('[GmailService] Error sending email:', error);
      throw error;
    }
  }

  /**
   * Disconnect Gmail by clearing stored tokens
   */
  async disconnect(): Promise<void> {
    console.log('[GmailService] Disconnecting Gmail...');

    try {
      await db
        .update(settings)
        .set({
          gmail_connected: false,
          gmail_email: null,
          gmail_refresh_token: null,
          updated_at: new Date(),
        })
        .where(eq(settings.id, await this.getSettingsId()));

      console.log('[GmailService] Gmail disconnected successfully');
    } catch (error) {
      console.error('[GmailService] Error disconnecting Gmail:', error);
      throw error;
    }
  }

  /**
   * Get settings ID (creates default settings if none exist)
   */
  private async getSettingsId(): Promise<string> {
    const existingSettings = await db.select().from(settings).limit(1);

    if (existingSettings.length > 0) {
      return existingSettings[0].id;
    }

    // Create default settings
    const [newSettings] = await db
      .insert(settings)
      .values({
        center_name: 'LGBTQ+ Center',
        staff_name: 'Staff',
      })
      .returning();

    return newSettings.id;
  }

  /**
   * Get stored refresh token from database
   */
  async getStoredRefreshToken(): Promise<string | null> {
    const [setting] = await db
      .select({ refreshToken: settings.gmail_refresh_token })
      .from(settings)
      .limit(1);

    return setting?.refreshToken || null;
  }

  /**
   * Check if Gmail is connected
   */
  async isConnected(): Promise<{ connected: boolean; email: string | null }> {
    const [setting] = await db
      .select({
        connected: settings.gmail_connected,
        email: settings.gmail_email,
      })
      .from(settings)
      .limit(1);

    return {
      connected: setting?.connected || false,
      email: setting?.email || null,
    };
  }
}

export const gmailService = new GmailService();
