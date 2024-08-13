import { NextResponse } from 'next/server';
import connectMongoDB from '../../../lib/mongo'; // Adjust the path to your MongoDB connection
import Settings from '../../../models/Settings'; // Adjust the path to your Mongoose model

export async function PUT(request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop() || '';
  const updatedItem = await request.json();

  // Ensure `engagingPrompt` is provided
  if (!updatedItem.engagingPrompt) {
    return NextResponse.json({ error: 'engagingPrompt is required' }, { status: 400 });
  }

  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Update item using Mongoose model
    const result = await Settings.findByIdAndUpdate(id, updatedItem, { new: true }).exec();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to update item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop() || '';

  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    // Delete item using Mongoose model
    const result = await Settings.findByIdAndDelete(id).exec();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to delete item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
