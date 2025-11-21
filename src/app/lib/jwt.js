import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.ENCRYPTION_SECRET_KEY;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

/**
 * Generate a JWT token for a user
 * @param {Object} payload - User data to encode in token
 * @param {string} payload.username - Username
 * @param {string} payload.type - User type
 * @param {string} payload.status - User status
 * @returns {string} JWT token
 */
export function generateToken(payload) {
  return jwt.sign(
    {
      username: payload.username,
      type: payload.type,
      status: payload.status,
    },
    JWT_SECRET,
    {
      expiresIn: '24h', // Token expires in 24 hours
    }
  );
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 * @param {Request} request - Next.js request object
 * @returns {string|null} Token or null if not found
 */
export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

