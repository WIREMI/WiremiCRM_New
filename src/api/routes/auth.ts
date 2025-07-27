import express from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import { validateRequest } from '../../middleware/validation';
import { authRateLimit, strictRateLimit } from '../../middleware/rateLimit';
import { AuthService } from '../../services/auth/services/AuthService';
import Joi from 'joi';

const router = express.Router();
const authService = new AuthService();

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  deviceFingerprint: Joi.string().required(),
  rememberDevice: Joi.boolean().optional(),
  captchaToken: Joi.string().optional()
});

const onboardAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('Admin', 'ComplianceOfficer', 'FinancialAnalyst', 'FraudAnalyst', 'CustomerSupport', 'FinanceManager', 'RiskAnalyst').required(),
  sendWelcomeEmail: Joi.boolean().optional()
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

/**
 * POST /api/auth/login
 * User login endpoint
 */
router.post('/login',
  authRateLimit,
  validateRequest(loginSchema),
  auditLog('auth', 'login'),
  async (req, res) => {
    try {
      const { email, password, deviceFingerprint, rememberDevice, captchaToken } = req.body;

      // TODO: Validate CAPTCHA if provided
      if (captchaToken) {
        // Implement CAPTCHA validation here
      }

      const loginResult = await authService.login({
        email,
        password,
        deviceFingerprint,
        rememberDevice
      });

      if (loginResult.requiresMfa) {
        return res.json({
          success: true,
          requiresMfa: true,
          mfaToken: loginResult.mfaToken,
          message: 'MFA verification required'
        });
      }

      // Set HTTP-only cookies for tokens
      res.cookie('accessToken', loginResult.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', loginResult.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        success: true,
        user: loginResult.user,
        message: 'Login successful'
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
  }
);

/**
 * POST /api/auth/logout
 * User logout endpoint
 */
router.post('/logout',
  authenticate,
  auditLog('auth', 'logout'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const sessionId = req.cookies?.sessionId;
      if (sessionId) {
        await authService.logout(sessionId);
      }

      // Clear cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.clearCookie('sessionId');

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
  }
);

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh',
  strictRateLimit,
  validateRequest(refreshTokenSchema),
  async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      const tokens = await authService.refreshTokens(refreshToken);

      // Set new tokens in cookies
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        success: true,
        message: 'Tokens refreshed successfully'
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }
  }
);

/**
 * POST /api/auth/onboard-admin
 * Admin onboarding endpoint - only accessible by SuperAdmin and Admin roles
 */
router.post('/onboard-admin',
  authenticate,
  authorize(['SuperAdmin', 'Admin']),
  strictRateLimit,
  validateRequest(onboardAdminSchema),
  auditLog('admin', 'onboard'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { email, firstName, lastName, password, role, sendWelcomeEmail } = req.body;
      const createdBy = req.user!.id;

      const newAdmin = await authService.onboardAdminUser({
        email,
        firstName,
        lastName,
        password,
        role,
        createdBy,
        sendWelcomeEmail: sendWelcomeEmail || false
      });

      res.status(201).json({
        success: true,
        data: {
          id: newAdmin.id,
          email: newAdmin.email,
          firstName: newAdmin.firstName,
          lastName: newAdmin.lastName,
          role: role,
          isActive: newAdmin.isActive
        },
        message: 'Admin user created successfully'
      });
    } catch (error) {
      console.error('Admin onboarding error:', error);
      
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create admin user'
      });
    }
  }
);

/**
 * POST /api/auth/verify-mfa
 * Verify MFA token
 */
router.post('/verify-mfa',
  authRateLimit,
  validateRequest(Joi.object({
    mfaToken: Joi.string().required(),
    code: Joi.string().required()
  })),
  auditLog('auth', 'mfa-verify'),
  async (req, res) => {
    try {
      const { mfaToken, code } = req.body;

      const loginResult = await authService.verifyMfa(mfaToken, code);

      // Set HTTP-only cookies for tokens
      res.cookie('accessToken', loginResult.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', loginResult.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        success: true,
        user: loginResult.user,
        message: 'MFA verification successful'
      });
    } catch (error) {
      console.error('MFA verification error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid MFA code'
      });
    }
  }
);

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me',
  authenticate,
  async (req: AuthenticatedRequest, res) => {
    try {
      res.json({
        success: true,
        user: req.user
      });
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user profile'
      });
    }
  }
);

export default router;