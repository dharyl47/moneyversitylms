// File: app/api/call-me-back/route.ts

import { NextResponse } from 'next/server';
import connectMongoDB from '@/app/lib/mongo';
import CallMeBackRequest from '../../models/CallMeBack';

// Create or update callback request by email
export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const { firstName, lastName, email, phone } = await req.json();

    if (!email || !phone) {
      return NextResponse.json({ error: 'Missing email or phone number' }, { status: 400 });
    }

    const callRequest = await CallMeBackRequest.findOneAndUpdate(
      { email },
      {
        $set: {
          firstName,
          lastName,
          phone,
          status: 'pending',
          dateCreated: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(callRequest);
  } catch (err) {
    console.error('Error in POST /call-me-back:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Get all Call Me Back requests
export async function GET() {
  try {
    await connectMongoDB();
    const requests = await CallMeBackRequest.find({});
    const response = NextResponse.json({ success: true, data: requests });
    response.headers.set('Cache-Control', 'public, max-age=180, stale-while-revalidate=300');
    return response;
  } catch (error) {
    console.error('Error fetching call me back data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
