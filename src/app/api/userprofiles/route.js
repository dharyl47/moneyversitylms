// app/api/userprofiles/route.js (or route.ts)
import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo';
import UserProfile from '../../models/UserProfile';
import { withAdminAuth } from '../../lib/authMiddleware';
import { validateObjectId } from '../../lib/validation';

async function handleGET() {
  try {
    await connectMongoDB();

    const userProfiles = await UserProfile.find({});

    const response = NextResponse.json({ success: true, data: userProfiles });
    // Disable all caching
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('CDN-Cache-Control', 'no-store');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('GET /api/userprofiles error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function handleDELETE(req) {
  try {
    await connectMongoDB();

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing id' },
        { status: 400 }
      );
    }

    if (!validateObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid id format' },
        { status: 400 }
      );
    }

    const deleted = await UserProfile.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/userprofiles error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handleGET);
export const DELETE = withAdminAuth(handleDELETE);
