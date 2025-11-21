import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectMongoDB from '../../lib/mongo';
import User from '../../models/User';
import { generateToken } from '../../lib/jwt';
import { validateUsername, validatePassword } from '../../lib/validation';
import { createRateLimiter } from '../../lib/rateLimiter';

// Rate limiter: 5 attempts per 15 minutes
const loginRateLimiter = createRateLimiter({ maxRequests: 5, windowMs: 15 * 60 * 1000 });

export async function POST(request) {
  try {
    // Apply rate limiting
    const rateLimitError = await loginRateLimiter(request);
    if (rateLimitError) {
      return NextResponse.json(
        { message: rateLimitError.message },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitError.retryAfter.toString(),
          },
        }
      );
    }

    await connectMongoDB();

    const body = await request.json();
    const { username, password } = body;

    // Validate input
    const validatedUsername = validateUsername(username);
    if (!validatedUsername) {
      return NextResponse.json(
        { message: 'Invalid username format' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { message: passwordValidation.message },
        { status: 400 }
      );
    }

    // Find the user by username, status, and type
    const user = await User.findOne({
      username: validatedUsername,
      status: 'active',
      type: 'admin',
    });

    // Use generic error message to prevent user enumeration
    if (!user || !user.password) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      username: user.username,
      type: user.type,
      status: user.status,
    });

    // Return token and user data (excluding password)
    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        type: user.type,
        status: user.status,
      },
    });
  } catch (error) {
    // Log error server-side without exposing details
    console.error('Authentication error:', error.message);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
