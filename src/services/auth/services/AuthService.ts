import bcrypt from 'bcryptjs';
import { User, CreateUserRequest, LoginRequest, LoginResponse, OnboardAdminRequest } from '../models/User';
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
    try {
      const user = await this.findUserByEmail(loginData.email.toLowerCase());
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check if account is locked
      if (user.isLocked) {
        // Check if lockout period has expired (30 minutes)
        const lockoutDuration = 30 * 60 * 1000; // 30 minutes
        const lockoutExpiry = new Date(user.updatedAt.getTime() + lockoutDuration);
        
        if (new Date() > lockoutExpiry) {
          // Unlock the account
          await this.resetLockoutCount(user.id);
        } else {
          throw new Error('Account is temporarily locked due to multiple failed login attempts');
        }
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(loginData.password, user.passwordHash);
      if (!isValidPassword) {
        await this.handleFailedLogin(user.id);
        throw new Error('Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is not active. Please contact administrator.');
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
      
      // Get user roles and permissions for token
      const userRoles = await this.getUserRoles(user.id);
      const userPermissions = await this.getUserPermissions(user.id);

      // Generate tokens
      const accessToken = this.tokenService.generateAccessToken(user, userRoles, userPermissions);
      const refreshToken = this.tokenService.generateRefreshToken();
      
      // Create session
      const session = await this.sessionService.createSession(user.id, device.id, loginData);
      await this.sessionService.updateRefreshToken(session.id, refreshToken);

      // Update last login
      await this.updateLastLogin(user.id);

      return {
        user: this.sanitizeUser(user),
        accessToken,
        refreshToken,
        requiresMfa: false
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Onboard a new admin user (internal process)
   */
  async onboardAdminUser(userData: OnboardAdminRequest): Promise<User> {
    const { email, firstName, lastName, password, role, createdBy, sendWelcomeEmail } = userData;

    try {
      // Check if user already exists
      const existingUser = await this.findUserByEmail(email.toLowerCase());
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
      const user = await this.createUser({
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        isActive: true, // Admin users are active immediately
        isLocked: false,
        lockoutCount: 0,
        emailVerifiedAt: new Date(), // Admin emails are pre-verified
      });

      // Assign role to user
      await this.assignUserRole(user.id, role);

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
    } catch (error) {
      console.error('Admin onboarding error:', error);
      throw error;
    }
  }

  async verifyMfa(mfaToken: string, code: string): Promise<LoginResponse> {
    try {
      // Validate MFA token and extract user ID
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

      // Get user roles and permissions for token
      const userRoles = await this.getUserRoles(user.id);
      const userPermissions = await this.getUserPermissions(user.id);

      // Generate tokens
      const accessToken = this.tokenService.generateAccessToken(user, userRoles, userPermissions);
      const refreshToken = this.tokenService.generateRefreshToken();

      // Create session
      const device = await this.deviceService.handleDevice(user.id, 'mfa-device', false);
      const session = await this.sessionService.createSession(user.id, device.id, {} as LoginRequest);
      await this.sessionService.updateRefreshToken(session.id, refreshToken);

      return {
        user: this.sanitizeUser(user),
        accessToken,
        refreshToken,
        requiresMfa: false
      };
    } catch (error) {
      console.error('MFA verification error:', error);
      throw error;
    }
  }

  async logout(sessionId: string): Promise<void> {
    try {
      await this.sessionService.invalidateSession(sessionId);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const session = await this.sessionService.validateRefreshToken(refreshToken);
      if (!session) {
        throw new Error('Invalid refresh token');
      }

      const user = await this.findUserById(session.userId);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // Get user roles and permissions for new token
      const userRoles = await this.getUserRoles(user.id);
      const userPermissions = await this.getUserPermissions(user.id);

      // Generate new tokens
      const newAccessToken = this.tokenService.generateAccessToken(user, userRoles, userPermissions);
      const newRefreshToken = this.tokenService.generateRefreshToken();

      // Rotate refresh token
      await this.sessionService.updateRefreshToken(session.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  private async handleFailedLogin(userId: string): Promise<void> {
    try {
      const lockoutThreshold = parseInt(process.env.LOCKOUT_THRESHOLD || '5');
      
      // Increment lockout count
      const user = await this.findUserById(userId);
      if (!user) return;

      const newLockoutCount = user.lockoutCount + 1;
      const shouldLock = newLockoutCount >= lockoutThreshold;

      await this.updateUser(userId, {
        lockoutCount: newLockoutCount,
        isLocked: shouldLock,
        updatedAt: new Date()
      });

      if (shouldLock) {
        console.log(`Account locked for user ${userId} after ${newLockoutCount} failed attempts`);
      }
    } catch (error) {
      console.error('Error handling failed login:', error);
    }
  }

  private async getUserRoles(userId: string): Promise<string[]> {
    try {
      // TODO: Implement role lookup from database
      // For now, return a default role based on user
      const user = await this.findUserById(userId);
      if (user?.email.includes('admin')) {
        return ['Admin'];
      }
      return ['User'];
    } catch (error) {
      console.error('Error getting user roles:', error);
      return ['User'];
    }
  }

  private async getUserPermissions(userId: string): Promise<string[]> {
    try {
      // TODO: Implement permission lookup from database
      // For now, return basic permissions
      const roles = await this.getUserRoles(userId);
      if (roles.includes('Admin') || roles.includes('SuperAdmin')) {
        return ['*']; // All permissions
      }
      return ['read:profile'];
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return ['read:profile'];
    }
  }

  private async assignUserRole(userId: string, role: string): Promise<void> {
    try {
      // TODO: Implement role assignment in database
      console.log(`Assigning role ${role} to user ${userId}`);
    } catch (error) {
      console.error('Error assigning user role:', error);
    }
  }

  private async createUser(userData: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    isLocked: boolean;
    lockoutCount: number;
    emailVerifiedAt?: Date;
  }): Promise<User> {
    try {
      // For now, create a mock user object
      // TODO: Replace with actual database creation
      const user: User = {
        id: this.generateId(),
        email: userData.email,
        passwordHash: userData.passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isActive: userData.isActive,
        isLocked: userData.isLocked,
        lockoutCount: userData.lockoutCount,
        emailVerifiedAt: userData.emailVerifiedAt,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store in a simple in-memory store for demo
      this.storeUser(user);
      
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  private async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      // TODO: Implement database update
      console.log(`Updating user ${userId}:`, updates);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  // Simple in-memory store for demo purposes
  private static userStore: Map<string, User> = new Map();

  private storeUser(user: User): void {
    AuthService.userStore.set(user.email, user);
    AuthService.userStore.set(user.id, user);
  }

  // Database operations - implemented with in-memory store for demo
  private async findUserByEmail(email: string): Promise<User | null> {
    try {
      return AuthService.userStore.get(email) || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  private async findUserById(id: string): Promise<User | null> {
    try {
      return AuthService.userStore.get(id) || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  private async resetLockoutCount(userId: string): Promise<void> {
    try {
      await this.updateUser(userId, {
        lockoutCount: 0,
        isLocked: false,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error resetting lockout count:', error);
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.updateUser(userId, {
        lastLoginAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  private async updatePassword(userId: string, passwordHash: string): Promise<void> {
    try {
      await this.updateUser(userId, {
        passwordHash,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating password:', error);
    }
  }

  private async activateUser(userId: string): Promise<void> {
    try {
      await this.updateUser(userId, {
        isActive: true,
        emailVerifiedAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error activating user:', error);
    }
  }

  private generateId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
    
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    return bcrypt.hash(password, saltRounds);
  }

  private sanitizeUser(user: User): Omit<User, 'passwordHash'> {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}