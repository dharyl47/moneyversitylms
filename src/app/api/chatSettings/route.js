// src/app/api/chatData/route.js

import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo';
import Chat from '../../models/ChatData';

export async function GET() {
  try {
    await connectMongoDB(); // Ensure MongoDB is connected

    const chatData = await Chat.findOne({}); // Assuming you have only one document to update
    return NextResponse.json({ success: true, data: chatData });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectMongoDB(); // Ensure MongoDB is connected

    const { friendlyTone, mainPrompt, llamaModel } = await request.json();

    // Update or create the document with the new data
    const updatedChatData = await Chat.findOneAndUpdate(
      {}, // Find the first document (or specify your criteria)
      { friendlyTone, mainPrompt, llamaModel },
      { new: true, upsert: true } // Create if not exists
    );

    return NextResponse.json({ success: true, data: updatedChatData }, { status: 200 });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
