import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import crypto from 'crypto';
import { MfaSecret } from '../models/Session';

export class MfaService {
  private appName: string;

  constructor() {
    this.appName = process.env.APP_NAME || 'Wiremi CRM';
  }

  async generateSecret(userId: string, userEmail: string): Promise<{ secret: string; qrCodeUrl: string; backupCodes: string[] }> {
    const secret = speakeasy.generateSecret({
      name: userEmail,
      issuer: this.appName,
      length: 32
    });

    const backupCodes = this.generateBackupCodes();

    // TODO: Store secret in database (encrypted)
    await this.storeMfaSecret(userId, secret.base32, backupCodes);

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32,
      qrCodeUrl,
      backupCodes
    };
  }

  async verifyTotp(userId: string, token: string): Promise<boolean> {
    const mfaSecret = await this.getMfaSecret(userId);
    if (!mfaSecret || !mfaSecret.isEnabled) {
      return false;
    }

    // Verify TOTP token
    const verified = speakeasy.totp.verify({
      secret: mfaSecret.secret,
      encoding: 'base32',
      token,
      window: 2 // Allow 2 time steps before/after current
    });

    if (verified) {
      return true;
    }

    // Check backup codes
    return this.verifyBackupCode(userId, token);
  }

  async enableMfa(userId: string, token: string): Promise<boolean> {
    const mfaSecret = await this.getMfaSecret(userId);
    if (!mfaSecret) {
      throw new Error('MFA secret not found');
    }

    // Verify the token before enabling
    const verified = speakeasy.totp.verify({
      secret: mfaSecret.secret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      throw new Error('Invalid MFA token');
    }

    // Enable MFA
    await this.updateMfaStatus(userId, true);
    return true;
  }

  async disableMfa(userId: string, password: string, token: string): Promise<boolean> {
    // TODO: Verify user password first
    const passwordValid = await this.verifyUserPassword(userId, password);
    if (!passwordValid) {
      throw new Error('Invalid password');
    }

    // Verify MFA token
    const tokenValid = await this.verifyTotp(userId, token);
    if (!tokenValid) {
      throw new Error('Invalid MFA token');
    }

    // Disable MFA
    await this.updateMfaStatus(userId, false);
    return true;
  }

  async isMfaEnabled(userId: string): Promise<boolean> {
    const mfaSecret = await this.getMfaSecret(userId);
    return mfaSecret?.isEnabled || false;
  }

  async regenerateBackupCodes(userId: string): Promise<string[]> {
    const backupCodes = this.generateBackupCodes();
    await this.updateBackupCodes(userId, backupCodes);
    return backupCodes;
  }

  private generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric codes
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  private async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const mfaSecret = await this.getMfaSecret(userId);
    if (!mfaSecret || !mfaSecret.backupCodes) {
      return false;
    }

    const codeIndex = mfaSecret.backupCodes.indexOf(code.toUpperCase());
    if (codeIndex === -1) {
      return false;
    }

    // Remove used backup code
    mfaSecret.backupCodes.splice(codeIndex, 1);
    await this.updateBackupCodes(userId, mfaSecret.backupCodes);

    return true;
  }

  // TODO: Implement database operations
  private async storeMfaSecret(userId: string, secret: string, backupCodes: string[]): Promise<void> {
    // TODO: Store encrypted MFA secret in database
  }

  private async getMfaSecret(userId: string): Promise<MfaSecret | null> {
    // TODO: Retrieve MFA secret from database
    return null;
  }

  private async updateMfaStatus(userId: string, isEnabled: boolean): Promise<void> {
    // TODO: Update MFA enabled status in database
  }

  private async updateBackupCodes(userId: string, backupCodes: string[]): Promise<void> {
    // TODO: Update backup codes in database
  }

  private async verifyUserPassword(userId: string, password: string): Promise<boolean> {
    // TODO: Verify user password
    return false;
  }
}