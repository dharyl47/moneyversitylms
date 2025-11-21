import { NextResponse, NextRequest } from 'next/server';
import { verifyToken, getTokenFromRequest } from './jwt';

// Extend NextRequest to include user property
export interface AuthenticatedRequest extends NextRequest {
  user?: {
    username: string;
    type: string;
    status: string;
  };
}

type RouteHandler = (
  request: AuthenticatedRequest | NextRequest | Request,
  context?: any
) => Promise<Response> | Response;

/**
 * Middleware to protect API routes with JWT authentication
 * @param handler - The API route handler
 * @returns Protected handler
 */
export function withAuth(handler: RouteHandler): RouteHandler {
  return async (request: AuthenticatedRequest | NextRequest | Request, context?: any) => {
    try {
      const token = getTokenFromRequest(request as NextRequest | Request);

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
      const authRequest = request as AuthenticatedRequest;
      authRequest.user = decoded;

      return handler(authRequest, context);
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
 * @param handler - The API route handler
 * @returns Protected handler
 */
export function withAdminAuth(handler: RouteHandler): RouteHandler {
  return withAuth(async (request: AuthenticatedRequest | NextRequest | Request, context?: any) => {
    const authRequest = request as AuthenticatedRequest;
    if (authRequest.user?.type !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }
    return handler(authRequest, context);
  });
}

