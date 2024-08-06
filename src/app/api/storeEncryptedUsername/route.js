import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';
import connectMongoDB from '../../lib/mongo';
import User from '../../models/User'; // Import the Mongoose model

export async function POST(request) {
  try {
    await connectMongoDB(); // Ensure MongoDB is connected

    const usePassword = 'testadmin'; // Your plaintext password
    const secretKey = 'MLKN87y8VSH&Y*SF'; // Your secret key
    const encryptedPassword = CryptoJS.AES.encrypt(usePassword, secretKey).toString();

    // Log the plaintext and encrypted password for debugging
    console.log('Plaintext password:', usePassword);
    console.log('Encrypted password:', encryptedPassword);

    // Find the user by username and update their password
    const result = await User.updateOne(
      { username: 'admin' }, // Use the username to find the user
      { $set: { password: encryptedPassword } }
    );

    // Log the query result
    console.log('Update result:', result);

    if (result.modifiedCount === 0) {
      console.log('No user found with the given username');
      return NextResponse.json({ message: 'No user found with the given username' }, { status: 404 });
    }

    console.log('Encrypted password stored in the database:', encryptedPassword);

    return NextResponse.json({ message: 'Encrypted password stored successfully.' });
  } catch (error) {
    console.error('Error storing encrypted password:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
