import bcrypt from 'bcryptjs';
import { User, CreateUserRequest, LoginRequest, LoginResponse } from '../models/User';
import { TokenService } from './TokenService';
import { DeviceService } from './DeviceService';
import { SessionService } from './SessionService';
import { EmailService } from './EmailService';
import { MfaService } from './MfaService';
import { prisma } from '../../../config/database';

export class AuthService {
  private tokenService: TokenService;
  private deviceService: DeviceService;
  private sessionService: SessionService;
  private emailService: EmailService;
  private mfaService: MfaService;

  constructor() {
    this.tokenService = new TokenService();
    this.deviceService = new DeviceService();
    this.sessionService = new SessionService();
    this.emailService = new EmailService();
    this.mfaService = new MfaService();
  }

  async register(userData: CreateUserRequest): Promise<{ user: User; verificationToken: string }> {
    // TODO: Validate email format and password strength
    // TODO: Check if email already exists
    
    const passwordHash = await this.hashPassword(userData.password);
    const verificationToken = this.tokenService.generateVerificationToken();
    
    // TODO: Create user in database
    const user: User = {
      id: this.generateId(),
      email: userData.email.toLowerCase(),
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isActive: false, // Requires email verification
      isLocked: false,
      lockoutCount: 0,
      birthday: userData.birthday,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // TODO: Store verification token with expiry
    // TODO: Send verification email
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    return { user, verificationToken };
  }

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    // TODO: Rate limiting check
    // TODO: CAPTCHA validation if required
    
    const user = await prisma.user.findUnique({
      where: { email: loginData.email.toLowerCase() }
    });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if account is locked
    if (user.isLocked) {
      // TODO: Check if lockout period has expired
      throw new Error('Account is temporarily locked');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(loginData.password, user.passwordHash);
    if (!isValidPassword) {
      await this.handleFailedLogin(user.id);
      throw new Error('Invalid credentials');
    }

    // Reset lockout count on successful login
    await this.resetLockoutCount(user.id);

    // Check if MFA is enabled
    const mfaEnabled = await this.mfaService.isMfaEnabled(user.id);
    if (mfaEnabled) {
      const mfaToken = this.tokenService.generateMfaToken(user.id);
      return {
        user: this.sanitizeUser(user),
        accessToken: '',
        refreshToken: '',
        requiresMfa: true,
        mfaToken
      };
    }

    // Handle device and session
    const device = await this.deviceService.handleDevice(user.id, loginData.deviceFingerprint, loginData.rememberDevice);
    const session = await this.sessionService.createSession(user.id, device.id, loginData);

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken();
    
    // Store refresh token hash
    await this.sessionService.updateRefreshToken(session.id, refreshToken);

    // Update last login
    await this.updateLastLogin(user.id);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
      requiresMfa: false
    };
  }

  /**
   * Onboard a new admin user (internal process)
   */
  async onboardAdminUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    createdBy: string;
    sendWelcomeEmail?: boolean;
  }): Promise<User> {
    const { email, firstName, lastName, password, role, createdBy, sendWelcomeEmail } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        isActive: true, // Admin users are active immediately
        isLocked: false,
        lockoutCount: 0,
        emailVerifiedAt: new Date(), // Admin emails are pre-verified
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // TODO: Assign role to user in role management system
    console.log(`Assigning role ${role} to user ${user.id}`);

    // Send welcome email if requested
    if (sendWelcomeEmail) {
      try {
        await this.emailService.sendAdminWelcomeEmail(email, firstName, password);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't fail the user creation if email fails
      }
    }

    // Log admin creation
    console.log(`Admin user created: ${email} by ${createdBy} with role ${role}`);

    return this.sanitizeUser(user);
  }

  async verifyMfa(mfaToken: string, code: string): Promise<LoginResponse> {
    // TODO: Validate MFA token and extract user ID
    const userId = this.tokenService.verifyMfaToken(mfaToken);
    const user = await this.findUserById(userId);
    
    if (!user) {
      throw new Error('Invalid MFA token');
    }

    // Verify TOTP code
    const isValidCode = await this.mfaService.verifyTotp(userId, code);
    if (!isValidCode) {
      throw new Error('Invalid MFA code');
    }

    // TODO: Complete login process (create session, generate tokens)
    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken();

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
      requiresMfa: false
    };
  }

  async logout(sessionId: string): Promise<void> {
    await this.sessionService.invalidateSession(sessionId);
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const session = await this.sessionService.validateRefreshToken(refreshToken);
    if (!session) {
      throw new Error('Invalid refresh token');
    }

    const user = await this.findUserById(session.userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Generate new tokens
    const newAccessToken = this.tokenService.generateAccessToken(user);
    const newRefreshToken = this.tokenService.generateRefreshToken();

    // Rotate refresh token
    await this.sessionService.updateRefreshToken(session.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return;
    }

    const resetToken = this.tokenService.generatePasswordResetToken();
    // TODO: Store reset token with expiry (15 minutes)
    
    await this.emailService.sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // TODO: Validate reset token and get user ID
    const userId = await this.tokenService.verifyPasswordResetToken(token);
    if (!userId) {
      throw new Error('Invalid or expired reset token');
    }

    // TODO: Validate password strength
    const passwordHash = await this.hashPassword(newPassword);
    
    // Update password and clear lockout
    await this.updatePassword(userId, passwordHash);
    await this.resetLockoutCount(userId);
    
    // Invalidate all sessions
    await this.sessionService.invalidateAllUserSessions(userId);
    
    // TODO: Delete reset token
  }

  async verifyEmail(token: string): Promise<void> {
    // TODO: Validate verification token and get user ID
    const userId = await this.tokenService.verifyEmailToken(token);
    if (!userId) {
      throw new Error('Invalid or expired verification token');
    }

    await this.activateUser(userId);
    // TODO: Delete verification token
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    return bcrypt.hash(password, saltRounds);
  }

  private async handleFailedLogin(userId: string): Promise<void> {
    // TODO: Increment lockout count
    // TODO: Lock account if threshold reached
    const lockoutThreshold = parseInt(process.env.LOCKOUT_THRESHOLD || '5');
    // TODO: Implement lockout logic
  }

  private sanitizeUser(user: User): Omit<User, 'passwordHash'> {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  private generateId(): string {
    // TODO: Implement proper ID generation (UUID)
    return Math.random().toString(36).substr(2, 9);
  }

  // TODO: Implement database operations
  private async findUserByEmail(email: string): Promise<User | null> {
    // TODO: Database query
    return null;
  }

  private async findUserById(id: string): Promise<User | null> {
    // TODO: Database query
    return null;
  }

  private async resetLockoutCount(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lockoutCount: 0,
        isLocked: false,
        updatedAt: new Date()
      }
    });
  }

  private async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  private async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        updatedAt: new Date()
      }
    });
  }

  private async activateUser(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true,
        emailVerifiedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }
}