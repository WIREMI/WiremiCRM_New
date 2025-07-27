import validator from 'validator';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class AuthValidator {
  
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('Email is required');
    } else if (!validator.isEmail(email)) {
      errors.push('Invalid email format');
    } else if (email.length > 254) {
      errors.push('Email is too long');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }
    
    // Length check
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password is too long (max 128 characters)');
    }
    
    // Character requirements
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Common password checks
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
    }
    
    // Sequential characters check
    if (this.hasSequentialChars(password)) {
      errors.push('Password should not contain sequential characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validateName(name: string, fieldName: string = 'Name'): ValidationResult {
    const errors: string[] = [];
    
    if (!name) {
      errors.push(`${fieldName} is required`);
    } else if (name.length < 2) {
      errors.push(`${fieldName} must be at least 2 characters long`);
    } else if (name.length > 50) {
      errors.push(`${fieldName} is too long (max 50 characters)`);
    } else if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validateBirthday(birthday: string): ValidationResult {
    const errors: string[] = [];
    
    if (birthday) {
      const date = new Date(birthday);
      const now = new Date();
      const minAge = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());
      const maxAge = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());
      
      if (isNaN(date.getTime())) {
        errors.push('Invalid date format');
      } else if (date > minAge) {
        errors.push('You must be at least 13 years old');
      } else if (date < maxAge) {
        errors.push('Invalid birth date');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validateMfaCode(code: string, isBackupCode: boolean = false): ValidationResult {
    const errors: string[] = [];
    
    if (!code) {
      errors.push('Verification code is required');
    } else if (isBackupCode) {
      if (!/^[A-Z0-9]{8}$/.test(code)) {
        errors.push('Backup code must be 8 alphanumeric characters');
      }
    } else {
      if (!/^\d{6}$/.test(code)) {
        errors.push('Verification code must be 6 digits');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validateApiTokenName(name: string): ValidationResult {
    const errors: string[] = [];
    
    if (!name) {
      errors.push('Token name is required');
    } else if (name.length < 3) {
      errors.push('Token name must be at least 3 characters long');
    } else if (name.length > 50) {
      errors.push('Token name is too long (max 50 characters)');
    } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      errors.push('Token name can only contain letters, numbers, spaces, hyphens, and underscores');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validateScopes(scopes: string[]): ValidationResult {
    const errors: string[] = [];
    const validScopes = [
      'read:profile', 'write:profile',
      'read:transactions', 'write:transactions',
      'read:users', 'write:users',
      'read:reports', 'admin'
    ];
    
    if (!scopes || scopes.length === 0) {
      errors.push('At least one scope is required');
    } else {
      const invalidScopes = scopes.filter(scope => !validScopes.includes(scope));
      if (invalidScopes.length > 0) {
        errors.push(`Invalid scopes: ${invalidScopes.join(', ')}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static sanitizeInput(input: string): string {
    return validator.escape(input.trim());
  }
  
  static isValidDeviceFingerprint(fingerprint: string): boolean {
    return /^[a-f0-9]{64}$/.test(fingerprint);
  }
  
  static isValidIpAddress(ip: string): boolean {
    return validator.isIP(ip);
  }
  
  private static hasSequentialChars(password: string): boolean {
    const sequences = [
      'abcdefghijklmnopqrstuvwxyz',
      '0123456789',
      'qwertyuiop',
      'asdfghjkl',
      'zxcvbnm'
    ];
    
    const lowerPassword = password.toLowerCase();
    
    for (const sequence of sequences) {
      for (let i = 0; i <= sequence.length - 3; i++) {
        const subseq = sequence.substring(i, i + 3);
        if (lowerPassword.includes(subseq)) {
          return true;
        }
      }
    }
    
    return false;
  }
}