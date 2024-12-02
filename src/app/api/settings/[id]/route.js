import { NextResponse } from 'next/server';
import connectMongoDB from '../../../lib/mongo'; // Adjust the path to your MongoDB connection
import Settings from '../../../models/Settings'; // Adjust the path to your Mongoose model

export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const formData = await request.formData();
    const engagingPrompt = formData.get('engagingPrompt');
    const engagingVideo = formData.get('engagingVideo') || null;
    const imageFile = formData.get('engagingImage');

    const updatedData = { engagingPrompt, engagingVideo };

    if (imageFile) {
      console.log('Uploading file:', imageFile.name);

      // Connect to MongoDB and retrieve bucket
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
      updatedData.engagingImage = fileName;
    }

    // Update the MongoDB document
    const result = await Settings.findByIdAndUpdate(id, updatedData, { new: true }).exec();

    if (!result) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Failed to update item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop() || '';

  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    // Delete item using Mongoose model
    const result = await Settings.findByIdAndDelete(id).exec();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to delete item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
