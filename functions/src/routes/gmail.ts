import { Router, Request, Response } from 'express';
import { gmailService } from '../services/gmail';

const router = Router();

// Middleware to verify authentication
const verifyAuth = async (req: Request, res: Response, next: Function) => {
  const userId = req.headers['x-user-id'] as string || 'default-user';
  (req as any).userId = userId;
  next();
};

router.use(verifyAuth);

/**
 * GET /gmail/auth - Initiate Gmail OAuth flow
 */
router.get('/auth', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const authUrl = gmailService.getAuthUrl(userId);
    
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
 * POST /gmail/auth - Get Gmail OAuth URL (POST alternative)
 */
router.post('/auth', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const authUrl = gmailService.getAuthUrl(userId);
    
    console.log('[GmailRoutes] Generated OAuth URL for POST request');
    res.json({
      success: true,
      data: { auth_url: authUrl },
    });
  } catch (error) {
    console.error('[GmailRoutes] Error initiating OAuth:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate OAuth flow',
    });
  }
});

/**
 * GET /gmail/callback - Handle OAuth callback from Google
 */
router.get('/callback', async (req: Request, res: Response) => {
  console.log('[GmailRoutes] GET /callback - Handling OAuth callback');

  const { code, error: oauthError, state } = req.query;
  const userId = state as string || 'default-user';

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
    const result = await gmailService.handleCallback(code, userId);

    console.log('[GmailRoutes] Gmail connected successfully:', result.email);

    // Redirect back to frontend with success
    const frontendUrl = process.env.FRONTEND_URL || 'https://cleveland-lgbtq-center.web.app';
    res.redirect(`${frontendUrl}/settings?gmail=connected&email=${encodeURIComponent(result.email)}`);
  } catch (error) {
    console.error('[GmailRoutes] Error handling OAuth callback:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const frontendUrl = process.env.FRONTEND_URL || 'https://cleveland-lgbtq-center.web.app';

    // Redirect to frontend with error
    res.redirect(`${frontendUrl}/settings?gmail=error&message=${encodeURIComponent(errorMessage)}`);
  }
});

/**
 * POST /gmail/disconnect - Disconnect Gmail
 */
router.post('/disconnect', async (req: Request, res: Response) => {
  console.log('[GmailRoutes] POST /disconnect - Disconnecting Gmail');

  try {
    const userId = (req as any).userId;
    await gmailService.disconnect(userId);

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
 * GET /gmail/status - Check Gmail connection status
 */
router.get('/status', async (req: Request, res: Response) => {
  console.log('[GmailRoutes] GET /status - Checking connection status');

  try {
    const userId = (req as any).userId;
    const status = await gmailService.isConnected(userId);

    console.log('[GmailRoutes] Gmail status:', status);

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('[GmailRoutes] Error checking Gmail status:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to check Gmail status',
    });
  }
});

export { router as gmailRoutes };
