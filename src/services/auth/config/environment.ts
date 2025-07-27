// Authentication & Security Environment Configuration
export const authConfig = {
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  
  // Password Security
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
  
  // Account Lockout
  lockoutThreshold: parseInt(process.env.LOCKOUT_THRESHOLD || '5'),
  lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '1800000'), // 30 minutes in ms
  
  // Rate Limiting
  loginRateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5
  },
  passwordResetRateLimit: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3
  },
  
  // reCAPTCHA
  recaptchaSecret: process.env.RECAPTCHA_SECRET_KEY || '',
  recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY || '',
  
  // Email Configuration
  emailConfig: {
    service: process.env.EMAIL_SERVICE || 'sendgrid',
    apiKey: process.env.EMAIL_API_KEY || '',
    fromEmail: process.env.FROM_EMAIL || 'noreply@wiremi.com',
    fromName: process.env.FROM_NAME || 'Wiremi CRM'
  },
  
  // Application URLs
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
  
  // Token Expiry Times
  verificationTokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
  passwordResetTokenExpiry: 15 * 60 * 1000, // 15 minutes
  mfaTokenExpiry: 10 * 60 * 1000, // 10 minutes
  
  // Cookie Configuration
  cookieConfig: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  
  // MFA Configuration
  mfaConfig: {
    appName: process.env.APP_NAME || 'Wiremi CRM',
    issuer: process.env.MFA_ISSUER || 'Wiremi',
    backupCodeCount: 10
  },
  
  // Session Configuration
  sessionConfig: {
    maxConcurrentSessions: parseInt(process.env.MAX_CONCURRENT_SESSIONS || '5'),
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    extendSessionOnActivity: true
  },
  
  // Device Trust Configuration
  deviceConfig: {
    maxTrustedDevices: parseInt(process.env.MAX_TRUSTED_DEVICES || '10'),
    deviceTrustExpiry: 90 * 24 * 60 * 60 * 1000 // 90 days
  },
  
  // API Token Configuration
  apiTokenConfig: {
    defaultExpiry: 365 * 24 * 60 * 60 * 1000, // 1 year
    maxTokensPerUser: parseInt(process.env.MAX_API_TOKENS_PER_USER || '10')
  }
};

// Validation function to ensure required environment variables are set
export const validateAuthConfig = (): void => {
  const requiredVars = [
    'JWT_SECRET'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // Warn about default values in production
  if (process.env.NODE_ENV === 'production') {
    const warnings: string[] = [];
    
    if (authConfig.jwtSecret === 'your-super-secret-jwt-key-change-in-production') {
      warnings.push('JWT_SECRET is using default value');
    }
    
    if (!authConfig.recaptchaSecret) {
      warnings.push('RECAPTCHA_SECRET_KEY is not set');
    }
    
    if (!authConfig.emailConfig.apiKey) {
      warnings.push('EMAIL_API_KEY is not set');
    }
    
    if (warnings.length > 0) {
      console.warn('Auth Configuration Warnings:', warnings.join(', '));
    }
  }
};