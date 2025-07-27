import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Audit logging middleware
 */
export const auditLog = (resource: string, action: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log the action after response is sent
      setImmediate(async () => {
        try {
          await logAuditEvent(req, resource, action, res.statusCode, data);
        } catch (error) {
          console.error('Audit logging failed:', error);
        }
      });
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};

/**
 * Log audit event to database
 */
async function logAuditEvent(
  req: AuthenticatedRequest,
  resource: string,
  action: string,
  statusCode: number,
  responseData: any
): Promise<void> {
  try {
    const details: any = {
      method: req.method,
      url: req.originalUrl,
      statusCode,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };

    // Add request body for create/update operations
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      details.requestBody = req.body;
    }

    // Add response data for successful operations
    if (statusCode >= 200 && statusCode < 300) {
      details.response = responseData;
    }

    // Extract resource ID from URL params or response
    let resourceId = req.params.id;
    if (!resourceId && responseData && typeof responseData === 'object') {
      const parsed = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;
      resourceId = parsed.data?.id || parsed.id;
    }

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id || 'anonymous',
        action: `${resource}:${action}`,
        resource,
        resourceId,
        details,
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      }
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}