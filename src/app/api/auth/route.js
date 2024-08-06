// pages/api/login.js

import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo';
import User from '../../models/User'; // Import the Mongoose model

export async function POST(request) {
  try {
    await connectMongoDB(); // Ensure MongoDB is connected

    const { username, password } = await request.json(); // Get the username and password from the request body
    const users = await User.find();
     console.log('All users:', users);
    // Find the user by username, status, and type
    const user = await User.findOne({ username, status: 'active', type: 'admin' });

    if (!user) {
      console.log('No active admin user found with the given username');
      return NextResponse.json({ message: 'Invalid username or passwordsss' }, { status: 401 });
    }

    // Compare the plaintext password with the stored password
    if (user.password !== password) {
      console.log('Password mismatch');
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    console.log('User logged in successfully');
    return NextResponse.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
