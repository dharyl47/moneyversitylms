import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from './jwt';

/**
 * Middleware to protect API routes with JWT authentication
 * @param {Function} handler - The API route handler
 * @returns {Function} Protected handler
 */
export function withAuth(handler) {
  return async (request, context) => {
    try {
      const token = getTokenFromRequest(request);

      if (!token) {
        return NextResponse.json(
          { message: 'Authentication required' },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);

      if (!decoded) {
        return NextResponse.json(
          { message: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Attach user info to request for use in handlers
      request.user = decoded;

      return handler(request, context);
    } catch (error) {
      return NextResponse.json(
        { message: 'Authentication error' },
        { status: 401 }
      );
    }
  };
}

/**
 * Middleware to check if user is admin
 * @param {Function} handler - The API route handler
 * @returns {Function} Protected handler
 */
export function withAdminAuth(handler) {
  return withAuth(async (request, context) => {
    if (request.user?.type !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }
    return handler(request, context);
  });
}

