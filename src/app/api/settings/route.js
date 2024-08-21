import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo'; // Adjust the path to your MongoDB connection
import Settings from '../../models/Settings'; // Adjust the path to your Mongoose model

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Parse the form data
    const formData = await request.formData();
    const engagingPrompt = formData.get('engagingPrompt');
    const engagingVideo = formData.get('engagingVideo') || null;
    const imageFile = formData.get('image') || null;

    // Ensure `engagingPrompt` is provided
    if (!engagingPrompt) {
      return NextResponse.json({ error: 'engagingPrompt is required' }, { status: 400 });
    }

    // Create a new settings document
    const newSettings = new Settings({
      engagingPrompt,
      engagingVideo,
      imageFile, // Assuming you handle image saving elsewhere, like using GridFS or similar
    });

    // Save to the database
    const savedSettings = await newSettings.save();

    return NextResponse.json(savedSettings, { status: 201 });
  } catch (error) {
    console.error('Failed to save content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
