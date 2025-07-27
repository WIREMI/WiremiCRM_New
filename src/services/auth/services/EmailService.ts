export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private baseUrl: string;
  private fromEmail: string;

  constructor() {
    this.baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@wiremi.com';
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.baseUrl}/auth/verify-email?token=${token}`;
    
    const template = this.getVerificationEmailTemplate(verificationUrl);
    
    await this.sendEmail(email, template);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.baseUrl}/auth/reset-password?token=${token}`;
    
    const template = this.getPasswordResetEmailTemplate(resetUrl);
    
    await this.sendEmail(email, template);
  }

  async sendNewDeviceNotification(email: string, deviceInfo: string, ipAddress: string): Promise<void> {
    const template = this.getNewDeviceEmailTemplate(deviceInfo, ipAddress);
    
    await this.sendEmail(email, template);
  }

  async sendLockoutWarningEmail(email: string, attemptsRemaining: number): Promise<void> {
    const template = this.getLockoutWarningEmailTemplate(attemptsRemaining);
    
    await this.sendEmail(email, template);
  }

  async sendAccountLockedEmail(email: string, unlockTime: Date): Promise<void> {
    const template = this.getAccountLockedEmailTemplate(unlockTime);
    
    await this.sendEmail(email, template);
  }

  private async sendEmail(to: string, template: EmailTemplate): Promise<void> {
    // TODO: Implement actual email sending using your preferred service
    // (SendGrid, AWS SES, Nodemailer, etc.)
    console.log(`Sending email to ${to}: ${template.subject}`);
  }

  private getVerificationEmailTemplate(verificationUrl: string): EmailTemplate {
    return {
      subject: 'Verify Your Wiremi CRM Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Welcome to Wiremi CRM</h2>
          <p>Thank you for creating your account. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't create this account, please ignore this email.
          </p>
          <p style="color: #6b7280; font-size: 14px;">
            This link will expire in 24 hours.
          </p>
        </div>
      `,
      text: `Welcome to Wiremi CRM! Please verify your email address by visiting: ${verificationUrl}`
    };
  }

  private getPasswordResetEmailTemplate(resetUrl: string): EmailTemplate {
    return {
      subject: 'Reset Your Wiremi CRM Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this reset, please ignore this email.
          </p>
          <p style="color: #6b7280; font-size: 14px;">
            This link will expire in 15 minutes.
          </p>
        </div>
      `,
      text: `Reset your Wiremi CRM password by visiting: ${resetUrl}`
    };
  }

  private getNewDeviceEmailTemplate(deviceInfo: string, ipAddress: string): EmailTemplate {
    return {
      subject: 'New Device Login - Wiremi CRM',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">New Device Login Detected</h2>
          <p>We detected a login to your Wiremi CRM account from a new device:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Device:</strong> ${deviceInfo}</p>
            <p><strong>IP Address:</strong> ${ipAddress}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>If this was you, you can ignore this email. If you don't recognize this activity, please secure your account immediately.</p>
        </div>
      `,
      text: `New device login detected for your Wiremi CRM account. Device: ${deviceInfo}, IP: ${ipAddress}`
    };
  }

  private getLockoutWarningEmailTemplate(attemptsRemaining: number): EmailTemplate {
    return {
      subject: 'Security Alert - Wiremi CRM',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Security Alert</h2>
          <p>Multiple failed login attempts have been detected on your Wiremi CRM account.</p>
          <p><strong>Attempts remaining before lockout:</strong> ${attemptsRemaining}</p>
          <p>If this wasn't you, please secure your account immediately by changing your password.</p>
        </div>
      `,
      text: `Security alert: ${attemptsRemaining} login attempts remaining before account lockout.`
    };
  }

  private getAccountLockedEmailTemplate(unlockTime: Date): EmailTemplate {
    return {
      subject: 'Account Temporarily Locked - Wiremi CRM',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Account Temporarily Locked</h2>
          <p>Your Wiremi CRM account has been temporarily locked due to multiple failed login attempts.</p>
          <p><strong>Unlock time:</strong> ${unlockTime.toLocaleString()}</p>
          <p>If you believe this is an error or if you're concerned about unauthorized access, please contact support.</p>
        </div>
      `,
      text: `Your Wiremi CRM account is temporarily locked until ${unlockTime.toLocaleString()}.`
    };
  }
}