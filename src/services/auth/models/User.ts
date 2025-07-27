export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isLocked: boolean;
  lockoutCount: number;
  lastLoginAt?: Date;
  birthday?: Date;
  emailVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthday?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceFingerprint: string;
  rememberDevice?: boolean;
  captchaToken?: string;
}

export interface LoginResponse {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
  refreshToken: string;
  requiresMfa: boolean;
  mfaToken?: string;
}

export interface UserProfile extends Omit<User, 'passwordHash'> {
  roles: string[];
  permissions: string[];
  trustedDevices: number;
  mfaEnabled: boolean;
}