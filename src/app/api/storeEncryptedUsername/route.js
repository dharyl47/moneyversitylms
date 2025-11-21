import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo';
import User from '../../models/User';
import { hashPassword } from '../../lib/passwordUtils';
import { withAdminAuth } from '../../lib/authMiddleware';
import { validateUsername, validatePassword } from '../../lib/validation';

/**
 * Admin-only route to update user passwords with bcrypt hashing
 * This replaces the old encryption-based password storage
 */
async function handlePOST(request) {
  try {
    await connectMongoDB();

    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

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

    // Hash the password using bcrypt
    const hashedPassword = await hashPassword(password);

    // Find the user by username and update their password
    const result = await User.updateOne(
      { username: validatedUsername },
      { $set: { password: hashedPassword } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Password updated successfully',
      username: validatedUsername,
    });
  } catch (error) {
    console.error('Error updating password:', error.message);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const POST = withAdminAuth(handlePOST);
