// Simple in-memory rate limiter
// For production, consider using Redis-based rate limiting

const rateLimitStore = new Map();

/**
 * Simple rate limiter middleware
 * @param {Object} options - Rate limit options
 * @param {number} options.maxRequests - Maximum requests per window
 * @param {number} options.windowMs - Time window in milliseconds
 * @returns {Function} Rate limit middleware
 */
export function createRateLimiter({ maxRequests = 5, windowMs = 15 * 60 * 1000 }) {
  return async (request) => {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const key = `rate_limit_${ip}`;
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return null; // No rate limit exceeded
    }

    // Clean up expired records
    if (now > record.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return null;
    }

    if (record.count >= maxRequests) {
      return {
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      };
    }

    record.count++;
    rateLimitStore.set(key, record);
    return null;
  };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

