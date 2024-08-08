import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo';
import Settings from '../../models/Settings'; // Import the Mongoose model
import mongoose from 'mongoose';
export async function POST(request) {
  try {
    await connectMongoDB(); // Ensure MongoDB is connected

    const { video, images } = await request.json(); // Extract video and images from the request body

    // Create an update object that only includes fields that are present
    const updateFields = {};
    if (video) updateFields.engagingVideo = video;
    if (images) updateFields.engagingImage = images;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ message: 'No data provided to update.' }, { status: 400 });
    }
    const documentId = 'first';
    // Update or create the settings document
    const result = await Settings.updateOne(
      { engagingID: documentId }, // Filter by _id
      { $set: updateFields },
      { upsert: true } // Create a new document if one doesn't already exist
    );

    console.log('Update result:', result);

    return NextResponse.json({ message: 'Settings updated successfully.' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
