import crypto from 'crypto';

export class SecurityUtils {
  
  /**
   * Generate a cryptographically secure random token
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
  
  /**
   * Generate a secure random string with custom character set
   */
  static generateRandomString(length: number, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
    let result = '';
    const charsetLength = charset.length;
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charsetLength);
      result += charset[randomIndex];
    }
    
    return result;
  }
  
  /**
   * Hash a token using SHA-256
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
  
  /**
   * Generate backup codes for MFA
   */
  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    for (let i = 0; i < count; i++) {
      codes.push(this.generateRandomString(8, charset));
    }
    
    return codes;
  }
  
  /**
   * Constant-time string comparison to prevent timing attacks
   */
  static constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }
  
  /**
   * Generate a device fingerprint from request headers
   */
  static generateDeviceFingerprint(userAgent: string, acceptLanguage: string = '', acceptEncoding: string = ''): string {
    const data = `${userAgent}|${acceptLanguage}|${acceptEncoding}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }
  
  /**
   * Mask sensitive data for logging
   */
  static maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart.substring(0, 2)}***@${domain}`;
  }
  
  /**
   * Mask IP address for logging
   */
  static maskIpAddress(ip: string): string {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.***.***.`;
    }
    // For IPv6 or other formats, mask the last part
    return ip.substring(0, ip.lastIndexOf(':')) + ':***';
  }
  
  /**
   * Generate a CSRF token
   */
  static generateCsrfToken(): string {
    return this.generateSecureToken(32);
  }
  
  /**
   * Validate CSRF token
   */
  static validateCsrfToken(token: string, expectedToken: string): boolean {
    return this.constantTimeCompare(token, expectedToken);
  }
  
  /**
   * Generate a session ID
   */
  static generateSessionId(): string {
    return this.generateSecureToken(48);
  }
  
  /**
   * Check if a password has been compromised (placeholder for HaveIBeenPwned integration)
   */
  static async isPasswordCompromised(password: string): Promise<boolean> {
    // TODO: Integrate with HaveIBeenPwned API
    // For now, return false (not compromised)
    return false;
  }
  
  /**
   * Generate a secure API key
   */
  static generateApiKey(): string {
    const prefix = 'wcrm_'; // Wiremi CRM prefix
    const key = this.generateSecureToken(32);
    return `${prefix}${key}`;
  }
  
  /**
   * Validate API key format
   */
  static isValidApiKeyFormat(apiKey: string): boolean {
    return /^wcrm_[a-f0-9]{64}$/.test(apiKey);
  }
  
  /**
   * Generate a nonce for CSP
   */
  static generateNonce(): string {
    return crypto.randomBytes(16).toString('base64');
  }
  
  /**
   * Sanitize user input to prevent XSS
   */
  static sanitizeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  /**
   * Generate a secure password reset token with expiry
   */
  static generatePasswordResetToken(): { token: string; hash: string; expiresAt: Date } {
    const token = this.generateSecureToken(32);
    const hash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    return { token, hash, expiresAt };
  }
  
  /**
   * Generate email verification token with expiry
   */
  static generateEmailVerificationToken(): { token: string; hash: string; expiresAt: Date } {
    const token = this.generateSecureToken(32);
    const hash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    return { token, hash, expiresAt };
  }
  
  /**
   * Check if a timestamp is within a valid time window (prevents replay attacks)
   */
  static isWithinTimeWindow(timestamp: number, windowMs: number = 300000): boolean {
    const now = Date.now();
    const diff = Math.abs(now - timestamp);
    return diff <= windowMs;
  }
}