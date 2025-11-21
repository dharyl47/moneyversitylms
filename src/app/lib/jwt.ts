import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || process.env.ENCRYPTION_SECRET_KEY;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Type assertion: JWT_SECRET is guaranteed to be a string after the check above
const SECRET: string = JWT_SECRET;

interface TokenPayload {
  username: string;
  type: string;
  status: string;
}

/**
 * Generate a JWT token for a user
 * @param payload - User data to encode in token
 * @returns JWT token
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(
    {
      username: payload.username,
      type: payload.type,
      status: payload.status,
    },
    SECRET,
    {
      expiresIn: '24h', // Token expires in 24 hours
    }
  );
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 * @param request - Next.js request object
 * @returns Token or null if not found
 */
export function getTokenFromRequest(request: NextRequest | Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

