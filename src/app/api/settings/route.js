import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo'; // Adjust the path to your MongoDB connection
import Settings from '../../models/Settings'; // Adjust the path to your Mongoose model

export async function GET() {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    // Fetch all settings using Mongoose model
    const settings = await Settings.find({}).exec();

    // Return settings as JSON
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
