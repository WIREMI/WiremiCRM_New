import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/TokenService';
import { JwtPayload } from '../services/TokenService';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  sessionId?: string;
}

export class AuthMiddleware {
  private tokenService: TokenService;

  constructor() {
    this.tokenService = new TokenService();
  }

  authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractToken(req);
      
      if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
      }

      const payload = this.tokenService.verifyAccessToken(token);
      
      // TODO: Check if user is still active and not locked
      const userActive = await this.checkUserStatus(payload.userId);
      if (!userActive) {
        res.status(401).json({ error: 'User account is inactive' });
        return;
      }

      req.user = payload;
      req.sessionId = this.extractSessionId(req);
      
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };

  requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    next();
  };

  optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractToken(req);
      
      if (token) {
        const payload = this.tokenService.verifyAccessToken(token);
        req.user = payload;
        req.sessionId = this.extractSessionId(req);
      }
      
      next();
    } catch (error) {
      // Continue without authentication for optional auth
      next();
    }
  };

  private extractToken(req: Request): string | null {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check HTTP-only cookie
    const tokenCookie = req.cookies?.accessToken;
    if (tokenCookie) {
      return tokenCookie;
    }

    return null;
  }

  private extractSessionId(req: Request): string | undefined {
    return req.cookies?.sessionId;
  }

  private async checkUserStatus(userId: string): Promise<boolean> {
    // TODO: Check if user is active and not locked
    return true;
  }
}