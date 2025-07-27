import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  createLimiter = (options: {
    windowMs: number;
    maxRequests: number;
    keyGenerator?: (req: Request) => string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
  }) => {
    const {
      windowMs,
      maxRequests,
      keyGenerator = (req) => req.ip,
      skipSuccessfulRequests = false,
      skipFailedRequests = false
    } = options;

    return (req: Request, res: Response, next: NextFunction): void => {
      const key = keyGenerator(req);
      const now = Date.now();
      const windowStart = now - windowMs;

      // Initialize or get existing record
      if (!this.store[key] || this.store[key].resetTime <= now) {
        this.store[key] = {
          count: 0,
          resetTime: now + windowMs
        };
      }

      const record = this.store[key];

      // Check if limit exceeded
      if (record.count >= maxRequests) {
        res.status(429).json({
          error: 'Too many requests',
          retryAfter: Math.ceil((record.resetTime - now) / 1000)
        });
        return;
      }

      // Increment counter
      record.count++;

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, maxRequests - record.count).toString(),
        'X-RateLimit-Reset': new Date(record.resetTime).toISOString()
      });

      // Handle response to potentially skip counting
      const originalSend = res.send;
      res.send = function(body) {
        const statusCode = res.statusCode;
        
        // Decrement counter if we should skip this request
        if ((skipSuccessfulRequests && statusCode < 400) ||
            (skipFailedRequests && statusCode >= 400)) {
          record.count--;
        }
        
        return originalSend.call(this, body);
      };

      next();
    };
  };

  // Predefined limiters for common use cases
  loginLimiter = this.createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per window
    keyGenerator: (req) => `login:${req.ip}:${req.body.email || 'unknown'}`,
    skipSuccessfulRequests: true
  });

  passwordResetLimiter = this.createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 reset requests per hour
    keyGenerator: (req) => `reset:${req.ip}:${req.body.email || 'unknown'}`
  });

  registrationLimiter = this.createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5, // 5 registrations per hour per IP
    keyGenerator: (req) => `register:${req.ip}`
  });

  mfaLimiter = this.createLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 10, // 10 MFA attempts per 5 minutes
    keyGenerator: (req) => `mfa:${req.ip}:${req.body.email || req.body.mfaToken || 'unknown'}`
  });

  apiLimiter = this.createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000, // 1000 requests per 15 minutes
    keyGenerator: (req) => req.ip
  });

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime <= now) {
        delete this.store[key];
      }
    });
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}