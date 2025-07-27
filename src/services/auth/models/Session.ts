export interface Session {
  id: string;
  userId: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  refreshTokenHash: string;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt: Date;
}

export interface Device {
  id: string;
  userId: string;
  fingerprint: string;
  name: string;
  deviceType: DeviceType;
  browser?: string;
  os?: string;
  isTrusted: boolean;
  lastSeenAt: Date;
  createdAt: Date;
}

export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  UNKNOWN = 'unknown'
}

export interface ApiToken {
  id: string;
  userId: string;
  tokenHash: string;
  name: string;
  scopes: string[];
  lastUsedAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface MfaSecret {
  id: string;
  userId: string;
  secret: string;
  isEnabled: boolean;
  backupCodes: string[];
  createdAt: Date;
  enabledAt?: Date;
}