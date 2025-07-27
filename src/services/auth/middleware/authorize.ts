import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate';

export type Permission = string;
export type Role = string;

export class AuthorizationMiddleware {
  
  requirePermissions = (permissions: Permission[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userPermissions = req.user.permissions || [];
      const hasAllPermissions = permissions.every(permission => 
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        res.status(403).json({ 
          error: 'Insufficient permissions',
          required: permissions,
          current: userPermissions
        });
        return;
      }

      next();
    };
  };

  requireRoles = (roles: Role[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userRoles = req.user.roles || [];
      const hasRequiredRole = roles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        res.status(403).json({ 
          error: 'Insufficient role privileges',
          required: roles,
          current: userRoles
        });
        return;
      }

      next();
    };
  };

  requireAnyPermission = (permissions: Permission[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userPermissions = req.user.permissions || [];
      const hasAnyPermission = permissions.some(permission => 
        userPermissions.includes(permission)
      );

      if (!hasAnyPermission) {
        res.status(403).json({ 
          error: 'Insufficient permissions',
          required: `Any of: ${permissions.join(', ')}`,
          current: userPermissions
        });
        return;
      }

      next();
    };
  };

  requireSuperAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const userRoles = req.user.roles || [];
    if (!userRoles.includes('SuperAdmin')) {
      res.status(403).json({ error: 'Super admin access required' });
      return;
    }

    next();
  };

  requireOwnershipOrAdmin = (resourceUserIdField: string = 'userId') => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userRoles = req.user.roles || [];
      const isAdmin = userRoles.includes('SuperAdmin') || userRoles.includes('Admin');
      
      // If user is admin, allow access
      if (isAdmin) {
        next();
        return;
      }

      // Check ownership
      const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
      if (resourceUserId === req.user.userId) {
        next();
        return;
      }

      res.status(403).json({ error: 'Access denied: insufficient privileges or ownership' });
    };
  };
}