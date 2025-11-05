import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo';
import DownloadLog from '../../models/DownloadLog';

// Get all download logs with optional filtering
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const downloadType = searchParams.get('downloadType'); // 'user_report' or 'resource_template'
    const year = searchParams.get('year'); // Filter by year

    // Build query
    const query = {};
    if (downloadType) {
      query.downloadType = downloadType;
    }
    if (year && year !== 'all') {
      const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
      query.downloadDate = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const downloadLogs = await DownloadLog.find(query).sort({ downloadDate: -1 });

    const response = NextResponse.json({ success: true, data: downloadLogs });
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error) {
    console.error('Error fetching download logs:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
