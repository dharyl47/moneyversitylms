import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import Settings from '../../models/Settings';
import connectMongoDB from '../../lib/mongo';

export const POST = async (req) => {
  const { client, bucket } = await connectMongoDB();

  let name;
  let image;

  const formData = await req.formData();
  let engagingPrompt = '';
  let engagingVideo = '';

  for (const [key, value] of formData.entries()) {
    if (key === 'name') {
      name = value;
    }

    if (key === 'engagingPrompt') {
      engagingPrompt = value || '';
    }

    if (key === 'engagingVideo') {
      engagingVideo = value || '';
    }

    if (value instanceof File) {
      image = Date.now() + value.name;
      const buffer = Buffer.from(await value.arrayBuffer());
      const stream = Readable.from(buffer);
      const uploadStream = bucket.openUploadStream(image, {});
      await stream.pipe(uploadStream);
    }
  }

  const newItem = new Settings({
    engagingID: 'first',
    engagingImage: image || '', // Set to empty string if no image
    engagingPrompt,
    engagingVideo,
  });

  await newItem.save();

  return NextResponse.json({ message: 'Content saved successfully.' });
};

export const GET = async () => {
  const { client, bucket } = await connectMongoDB();

  const posts = await Settings.find({});
  return NextResponse.json(posts);
};
