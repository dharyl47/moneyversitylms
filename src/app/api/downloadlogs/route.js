import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo';
import DownloadLog from '../../models/DownloadLog';
import { withAdminAuth } from '../../lib/authMiddleware';

// Get all download logs with optional filtering
async function handleGET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const downloadType = searchParams.get('downloadType');
    const year = searchParams.get('year');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam) || 1000, 1), 10000) : 1000;

    // Build query
    const query = {};
    if (downloadType && ['user_report', 'resource_template'].includes(downloadType)) {
      query.downloadType = downloadType;
    }
    if (year && year !== 'all' && /^\d{4}$/.test(year)) {
      const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
      query.downloadDate = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const downloadLogs = await DownloadLog.find(query)
      .sort({ downloadDate: -1 })
      .limit(limit)
      .lean();

    const totalCount = await DownloadLog.countDocuments(query);

    const stats = await DownloadLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$downloadType',
          count: { $sum: 1 }
        }
      }
    ]);

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
    console.error('Error fetching download logs:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch download logs'
      },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handleGET);
