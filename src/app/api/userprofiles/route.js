import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo';
import UserProfile from '../../models/UserProfile';

export async function GET() {
  try {
    await connectMongoDB();

    const userProfiles = await UserProfile.find({});

    const response = NextResponse.json({ success: true, data: userProfiles });
    response.headers.set('Cache-Control', 'public, max-age=180, stale-while-revalidate=300'); // Cache for 3 minutes, revalidate for 5 minutes
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
