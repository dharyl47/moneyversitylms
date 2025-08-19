// app/api/userprofiles/route.js (or route.ts)
import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo';
import UserProfile from '../../models/UserProfile';

export async function GET() {
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
    console.error('GET /api/userprofiles error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    await connectMongoDB();

    // Expect { id } in request body
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    const deleted = await UserProfile.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    // Return JSON so client .json() won’t throw
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/userprofiles error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
