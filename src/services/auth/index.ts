// Authentication & Security Module Exports

// Models
export * from './models/User';
export * from './models/Role';
export * from './models/Session';

// Services
export { AuthService } from './services/AuthService';
export { TokenService } from './services/TokenService';
export { MfaService } from './services/MfaService';
export { DeviceService } from './services/DeviceService';
export { SessionService } from './services/SessionService';
export { EmailService } from './services/EmailService';

// Middleware
export { AuthMiddleware } from './middleware/authenticate';
export { AuthorizationMiddleware } from './middleware/authorize';
export { RateLimiter } from './middleware/rateLimiter';

// Components
export { default as LoginPage } from './components/LoginPage';
export { default as TwoFactorPage } from './components/TwoFactorPage';
export { default as AccountSettingsPage } from './components/AccountSettingsPage';

// Utils
export { AuthValidator } from './utils/validation';
export { SecurityUtils } from './utils/security';

// Configuration
export { authConfig, validateAuthConfig } from './config/environment';