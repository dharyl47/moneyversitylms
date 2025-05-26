import { NextResponse } from 'next/server';
import connectMongoDB from '@/app/lib/mongo';
import CallMeBackRequest from '@/app/models/CallMeBack';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongoDB();
    const { status } = await req.json();
    const { id } = params;

    if (!status || !['pending', 'contacted'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await CallMeBackRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error updating status:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
