# Authentication & Security Module

A comprehensive authentication and security module for Wiremi Fintech CRM with enterprise-grade security features.

## Features

### Core Authentication
- **User Registration & Login**: Secure user registration with email verification
- **Password Security**: bcrypt hashing with configurable salt rounds
- **JWT Tokens**: Access and refresh token management with rotation
- **Session Management**: Secure session handling with device tracking

### Multi-Factor Authentication (MFA)
- **TOTP Support**: Time-based one-time passwords using authenticator apps
- **Backup Codes**: Secure backup codes for account recovery
- **QR Code Generation**: Easy setup with QR codes

### Security Features
- **Account Lockout**: Automatic lockout after failed login attempts
- **Rate Limiting**: Configurable rate limits for sensitive endpoints
- **Device Trust**: Remember trusted devices functionality
- **CAPTCHA Integration**: reCAPTCHA support after failed attempts

### Role-Based Access Control (RBAC)
- **Roles & Permissions**: Granular permission system
- **Middleware**: Authentication and authorization middleware
- **API Tokens**: Scoped API tokens for third-party integrations

### Security Best Practices
- **HTTP-Only Cookies**: Secure token storage
- **CSRF Protection**: Cross-site request forgery protection
- **Input Validation**: Comprehensive input sanitization
- **Audit Logging**: Security event logging

## Architecture

```
src/services/auth/
├── models/              # Data models and interfaces
│   ├── User.ts         # User model and interfaces
│   ├── Role.ts         # Role and permission models
│   └── Session.ts      # Session and device models
├── services/           # Business logic services
│   ├── AuthService.ts  # Core authentication logic
│   ├── TokenService.ts # JWT and token management
│   ├── MfaService.ts   # Multi-factor authentication
│   ├── DeviceService.ts # Device management
│   ├── SessionService.ts # Session management
│   └── EmailService.ts # Email notifications
├── middleware/         # Express middleware
│   ├── authenticate.ts # Authentication middleware
│   ├── authorize.ts    # Authorization middleware
│   └── rateLimiter.ts  # Rate limiting middleware
├── components/         # React UI components
│   ├── LoginPage.tsx   # Login form
│   ├── RegisterPage.tsx # Registration form
│   ├── TwoFactorPage.tsx # MFA verification
│   └── AccountSettingsPage.tsx # Security settings
├── utils/              # Utility functions
│   ├── validation.ts   # Input validation
│   └── security.ts     # Security utilities
├── config/             # Configuration
│   └── environment.ts  # Environment variables
└── README.md          # This file
```

## Data Models

### User
- Basic user information with security fields
- Password hashing and lockout tracking
- Email verification status

### Role & Permissions
- Hierarchical role system
- Granular permissions for resources and actions
- Many-to-many relationships

### Session & Device
- Session tracking with device fingerprinting
- Trusted device management
- IP address and user agent logging

### MFA & API Tokens
- TOTP secrets and backup codes
- Scoped API tokens with expiration
- Token usage tracking

## Security Configuration

### Environment Variables
```bash
# JWT Configuration
JWT_SECRET=your-super-secret-key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Password Security
BCRYPT_SALT_ROUNDS=12

# Account Lockout
LOCKOUT_THRESHOLD=5
LOCKOUT_DURATION=1800000

# reCAPTCHA
RECAPTCHA_SECRET_KEY=your-recaptcha-secret
RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# Email Service
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your-email-api-key
FROM_EMAIL=noreply@wiremi.com
```

## Usage Examples

### Authentication Middleware
```typescript
import { AuthMiddleware } from './middleware/authenticate';
import { AuthorizationMiddleware } from './middleware/authorize';

const auth = new AuthMiddleware();
const authz = new AuthorizationMiddleware();

// Require authentication
app.use('/api/protected', auth.authenticate);

// Require specific permissions
app.get('/api/users', 
  auth.authenticate,
  authz.requirePermissions(['user:read']),
  getUsersHandler
);

// Require admin role
app.delete('/api/users/:id',
  auth.authenticate,
  authz.requireRoles(['Admin', 'SuperAdmin']),
  deleteUserHandler
);
```

### Rate Limiting
```typescript
import { RateLimiter } from './middleware/rateLimiter';

const rateLimiter = new RateLimiter();

// Apply rate limiting to login endpoint
app.post('/auth/login', rateLimiter.loginLimiter, loginHandler);

// Apply rate limiting to password reset
app.post('/auth/forgot-password', rateLimiter.passwordResetLimiter, forgotPasswordHandler);
```

### Service Usage
```typescript
import { AuthService } from './services/AuthService';

const authService = new AuthService();

// Register new user
const { user, verificationToken } = await authService.register({
  email: 'user@example.com',
  password: 'SecurePassword123!',
  firstName: 'John',
  lastName: 'Doe'
});

// Login user
const loginResult = await authService.login({
  email: 'user@example.com',
  password: 'SecurePassword123!',
  deviceFingerprint: 'device-fingerprint-hash',
  rememberDevice: true
});
```

## Security Considerations

### Password Security
- Minimum 8 characters with complexity requirements
- bcrypt hashing with salt rounds ≥ 12
- Common password detection
- Sequential character prevention

### Token Security
- Short-lived access tokens (15 minutes)
- Longer-lived refresh tokens (7 days)
- Token rotation on refresh
- Secure HTTP-only cookies

### Session Security
- Device fingerprinting
- IP address tracking
- Session timeout and cleanup
- Concurrent session limits

### Input Validation
- Email format validation
- Password strength checking
- Input sanitization
- XSS prevention

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh
- `POST /auth/verify-email` - Email verification

### Password Management
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### Multi-Factor Authentication
- `POST /auth/2fa/enable` - Enable MFA
- `POST /auth/2fa/verify` - Verify MFA code
- `POST /auth/2fa/disable` - Disable MFA

## Testing

### Unit Tests
- Service layer testing
- Validation function testing
- Security utility testing

### Integration Tests
- Authentication flow testing
- Rate limiting testing
- MFA workflow testing

### Security Tests
- Password strength validation
- Token security testing
- Session management testing

## Deployment

### Production Checklist
- [ ] Set strong JWT secret
- [ ] Configure email service
- [ ] Set up reCAPTCHA
- [ ] Enable HTTPS
- [ ] Configure rate limiting
- [ ] Set up monitoring
- [ ] Enable audit logging

### Monitoring
- Failed login attempts
- Account lockouts
- Token usage patterns
- Security events

## Contributing

1. Follow security best practices
2. Add comprehensive tests
3. Update documentation
4. Review security implications
5. Test with security tools

## License

Proprietary - Wiremi Fintech CRM