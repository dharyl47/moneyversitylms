import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo';
import DownloadLog from '../../models/DownloadLog';

// Get all download logs with optional filtering
export async function GET(req) {
  try {
    console.log('📊 GetDownloadLogs API called (LMS)');
    
    console.log('🔌 Connecting to MongoDB...');
    await connectMongoDB();
    console.log('✅ MongoDB connected successfully');

    const { searchParams } = new URL(req.url);
    const downloadType = searchParams.get('downloadType'); // 'user_report' or 'resource_template'
    const year = searchParams.get('year'); // Filter by year
    const limit = parseInt(searchParams.get('limit') || '1000');

    // Build query
    const query = {};
    if (downloadType) {
      query.downloadType = downloadType;
      console.log('🔍 Filtering by downloadType:', downloadType);
    }
    if (year && year !== 'all') {
      const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
      query.downloadDate = {
        $gte: startDate,
        $lte: endDate,
      };
      console.log('🔍 Filtering by year:', year, 'from', startDate, 'to', endDate);
    }

    console.log('📋 Query:', JSON.stringify(query));

    console.log('📊 Fetching download logs from database...');
    const downloadLogs = await DownloadLog.find(query)
      .sort({ downloadDate: -1 })
      .limit(limit)
      .lean();

    console.log('✅ Found', downloadLogs.length, 'download log(s)');

    // Get total count
    const totalCount = await DownloadLog.countDocuments(query);
    console.log('📈 Total count:', totalCount);

    // Get statistics by type
    const stats = await DownloadLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$downloadType',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('📊 Statistics:', stats);

    const response = NextResponse.json({
      success: true,
      totalCount,
      count: downloadLogs.length,
      stats,
      data: downloadLogs,
      query: {
        downloadType: downloadType || null,
        year: year || null,
        limit
      }
    });
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error) {
    console.error('❌ Error fetching download logs:', error);
    if (error instanceof Error) {
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch download logs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
