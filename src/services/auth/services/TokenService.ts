import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User';

export interface JwtPayload {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
  type: 'access' | 'refresh' | 'mfa';
}

export class TokenService {
  private jwtSecret: string;
  private accessTokenExpiry: string;
  private refreshTokenExpiry: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRES || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES || '7d';
  }

  generateAccessToken(user: User, roles: string[] = [], permissions: string[] = []): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
      permissions,
      type: 'access'
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'wiremi-crm',
      audience: 'wiremi-users'
    });
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  generateMfaToken(userId: string): string {
    const payload = {
      userId,
      type: 'mfa'
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '10m', // Short-lived MFA token
      issuer: 'wiremi-crm'
    });
  }

  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  generatePasswordResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  generateApiToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'wiremi-crm',
        audience: 'wiremi-users'
      }) as JwtPayload;

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  verifyMfaToken(token: string): string {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'wiremi-crm'
      }) as any;

      if (decoded.type !== 'mfa') {
        throw new Error('Invalid token type');
      }

      return decoded.userId;
    } catch (error) {
      throw new Error('Invalid or expired MFA token');
    }
  }

  async verifyPasswordResetToken(token: string): Promise<string | null> {
    // TODO: Verify token against database storage with expiry check
    // This should check if token exists and hasn't expired (15 minutes)
    return null;
  }

  async verifyEmailToken(token: string): Promise<string | null> {
    // TODO: Verify token against database storage with expiry check
    // This should check if token exists and hasn't expired (24 hours)
    return null;
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  isTokenExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }
}