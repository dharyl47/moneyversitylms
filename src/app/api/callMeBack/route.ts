// File: app/api/call-me-back/route.ts

import { NextResponse } from 'next/server';
import connectMongoDB from '@/app/lib/mongo';
import CallMeBackRequest from '../../models/CallMeBack';
import { withAdminAuth } from '../../lib/authMiddleware';
import { validateEmail, validateString } from '../../lib/validation';

// Create or update callback request by email (public endpoint)
export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const { firstName, lastName, email, phone } = body;

    // Validate input
    const validatedEmail = validateEmail(email);
    const validatedPhone = validateString(phone, { minLength: 10, maxLength: 20 });

    if (!validatedEmail || !validatedPhone) {
      return NextResponse.json({ error: 'Invalid email or phone number' }, { status: 400 });
    }

    const validatedFirstName = validateString(firstName || '', { maxLength: 100, allowEmpty: true });
    const validatedLastName = validateString(lastName || '', { maxLength: 100, allowEmpty: true });

    const callRequest = await CallMeBackRequest.findOneAndUpdate(
      { email: validatedEmail },
      {
        $set: {
          firstName: validatedFirstName || '',
          lastName: validatedLastName || '',
          phone: validatedPhone,
          status: 'pending',
          dateCreated: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(callRequest);
  } catch (err) {
    console.error('Error in POST /call-me-back:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Get all Call Me Back requests
async function handleGET(request: Request) {
  try {
    await connectMongoDB();
    const requests = await CallMeBackRequest.find({});
    const response = NextResponse.json({ success: true, data: requests });
    response.headers.set('Cache-Control', 'public, max-age=180, stale-while-revalidate=300');
    return response;
  } catch (error) {
    console.error('Error fetching call me back data:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = withAdminAuth(handleGET);
