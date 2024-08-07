import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongo';
import LearningMaterial from '../../models/LearningMaterial';

export async function GET() {
  try {
    await connectMongoDB(); // Ensure MongoDB is connected

    const learningMaterials = await LearningMaterial.find({});

    return NextResponse.json({ success: true, data: learningMaterials });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectMongoDB(); // Ensure MongoDB is connected

    const { prompt, addedBy } = await request.json(); // Get the prompt and addedBy from the request body

    const newLearningMaterial = new LearningMaterial({ prompt, addedBy, createdAt: new Date() });
    await newLearningMaterial.save();

    return NextResponse.json({ success: true, data: newLearningMaterial }, { status: 201 });
  } catch (error) {
    console.error('Error adding data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
