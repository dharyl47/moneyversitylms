import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo'; // Adjust the path to your MongoDB connection
import Settings from '../../models/Settings'; // Adjust the path to your Mongoose model

export async function POST(request) {
  try {
    const formData = await request.formData();
    const engagingPrompt = formData.get('engagingPrompt');
    const engagingVideo = formData.get('engagingVideo') || null;
    const imageFile = formData.get('image');

    const newData = { engagingPrompt, engagingVideo };

    if (imageFile) {
      console.log('Uploading file:', imageFile.name);

      // Connect to MongoDB and GridFS bucket
      const { bucket } = await connectMongoDB();

      const fileName = imageFile.name;
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      // Upload file to GridFS
      const uploadStream = bucket.openUploadStream(fileName);

      await new Promise((resolve, reject) => {
        uploadStream.end(buffer, (err) => {
          if (err) {
            console.error('File upload failed:', err);
            return reject(err);
          }
          console.log('File upload successful:', fileName);
          resolve();
        });
      });

      // Save the filename in the database
      newData.engagingImage = fileName;
    }

    // Save new data to the MongoDB collection
    await connectMongoDB();
    const result = await new Settings(newData).save();

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Failed to save content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}



export const GET = async () => {
  const { client, bucket } = await connectMongoDB();

  const posts = await Settings.find({});
  return NextResponse.json({ success: true, data: posts });
};
