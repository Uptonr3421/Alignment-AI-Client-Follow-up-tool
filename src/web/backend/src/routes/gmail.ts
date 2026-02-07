import { Router, Request, Response } from 'express';
import { gmailService } from '../services/gmail';
import { gmailAuthSchema } from '../shared/validation';

const router = Router();

/**
 * GET /api/gmail/auth
 * Redirect to Google OAuth consent screen
 */
router.get('/auth', (_req: Request, res: Response) => {
  console.log('[GmailRoutes] GET /auth - Initiating OAuth flow');

  try {
    const authUrl = gmailService.initiateAuth();
    console.log('[GmailRoutes] Redirecting to Google OAuth:', authUrl);
    res.redirect(authUrl);
  } catch (error) {
    console.error('[GmailRoutes] Error initiating OAuth:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate OAuth flow',
    });
  }
});

/**
 * GET /api/gmail/callback
 * Handle OAuth callback from Google
 */
router.get('/callback', async (req: Request, res: Response) => {
  console.log('[GmailRoutes] GET /callback - Handling OAuth callback');

  const { code, error: oauthError } = req.query;

  if (oauthError) {
    console.error('[GmailRoutes] OAuth error from Google:', oauthError);
    return res.status(400).json({
      success: false,
      error: `OAuth error: ${oauthError}`,
    });
  }

  if (!code || typeof code !== 'string') {
    console.error('[GmailRoutes] No authorization code received');
    return res.status(400).json({
      success: false,
      error: 'Authorization code is required',
    });
  }

  try {
    const result = await gmailService.handleCallback(code);

    console.log('[GmailRoutes] Gmail connected successfully:', result.email);

    // Redirect back to frontend settings page
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/settings?gmail=connected&email=${encodeURIComponent(result.email)}`);
  } catch (error) {
    console.error('[GmailRoutes] Error handling OAuth callback:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Redirect to frontend with error
    res.redirect(`${frontendUrl}/settings?gmail=error&message=${encodeURIComponent(errorMessage)}`);
  }
});

/**
 * POST /api/gmail/disconnect
 * Disconnect Gmail and clear stored tokens
 */
router.post('/disconnect', async (_req: Request, res: Response) => {
  console.log('[GmailRoutes] POST /disconnect - Disconnecting Gmail');

  try {
    await gmailService.disconnect();

    console.log('[GmailRoutes] Gmail disconnected successfully');

    res.json({
      success: true,
      message: 'Gmail disconnected successfully',
    });
  } catch (error) {
    console.error('[GmailRoutes] Error disconnecting Gmail:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to disconnect Gmail',
    });
  }
});

/**
 * GET /api/gmail/status
 * Check if Gmail is connected
 */
router.get('/status', async (_req: Request, res: Response) => {
  console.log('[GmailRoutes] GET /status - Checking connection status');

  try {
    const status = await gmailService.isConnected();

    console.log('[GmailRoutes] Gmail status:', status);

    res.json({
      success: true,
      data: {
        connected: status.connected,
        email: status.email,
      },
    });
  } catch (error) {
    console.error('[GmailRoutes] Error checking Gmail status:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to check Gmail status',
    });
  }
});

/**
 * POST /api/gmail/auth
 * Alternative endpoint for initiating OAuth via POST request
 */
router.post('/auth', (_req: Request, res: Response) => {
  console.log('[GmailRoutes] POST /auth - Initiating OAuth flow');

  try {
    const authUrl = gmailService.initiateAuth();
    console.log('[GmailRoutes] Generated OAuth URL for POST request');
    res.json({
      success: true,
      data: {
        auth_url: authUrl,
      },
    });
  } catch (error) {
    console.error('[GmailRoutes] Error initiating OAuth:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate OAuth flow',
    });
  }
});

export { router as gmailRoutes };
