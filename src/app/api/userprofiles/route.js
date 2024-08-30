import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo';
import UserProfile from '../../models/UserProfile';

export async function GET() {
    try {
      await connectMongoDB(); // Ensure MongoDB is connected
  
      const userProfiles  = await UserProfile.find({});
      return NextResponse.json({ success: true, data: userProfiles });
    } catch (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
  }

export async function DELETE(request) {
  try {
    await connectMongoDB(); // Ensure MongoDB is connected

    const { id } = await request.json(); // Get the id from the request body

    const deletedUserProfile = await UserProfile.findByIdAndDelete(id);

    if (!deletedUserProfile) {
      return NextResponse.json({ success: false, error: 'Learning Material not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedUserProfile });
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
  