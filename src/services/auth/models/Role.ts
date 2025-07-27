export interface Role {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  action: string;
  resource: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: Date;
}

// Common role names
export enum SystemRoles {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  COMPLIANCE_OFFICER = 'ComplianceOfficer',
  FRAUD_ANALYST = 'FraudAnalyst',
  CUSTOMER_SUPPORT = 'CustomerSupport',
  FINANCE_MANAGER = 'FinanceManager',
  RISK_ANALYST = 'RiskAnalyst',
  VIEWER = 'Viewer'
}

// Common permissions
export enum SystemPermissions {
  // User management
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  
  // Role management
  ROLE_CREATE = 'role:create',
  ROLE_READ = 'role:read',
  ROLE_UPDATE = 'role:update',
  ROLE_DELETE = 'role:delete',
  
  // Transaction management
  TRANSACTION_READ = 'transaction:read',
  TRANSACTION_APPROVE = 'transaction:approve',
  TRANSACTION_REJECT = 'transaction:reject',
  
  // Compliance
  COMPLIANCE_READ = 'compliance:read',
  COMPLIANCE_INVESTIGATE = 'compliance:investigate',
  COMPLIANCE_RESOLVE = 'compliance:resolve',
  
  // System administration
  SYSTEM_CONFIG = 'system:config',
  SYSTEM_AUDIT = 'system:audit'
}