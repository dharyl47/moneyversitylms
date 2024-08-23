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

export async function PUT(request) {
  try {
    await connectMongoDB(); // Ensure MongoDB is connected

    const { id, prompt, addedBy } = await request.json(); // Get the id, prompt, and addedBy from the request body

    const updatedLearningMaterial = await LearningMaterial.findByIdAndUpdate(
      id,
      { prompt, addedBy },
      { new: true } // Return the updated document
    );

    if (!updatedLearningMaterial) {
      return NextResponse.json({ success: false, error: 'Learning Material not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedLearningMaterial });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectMongoDB(); // Ensure MongoDB is connected

    const { id } = await request.json(); // Get the id from the request body

    const deletedLearningMaterial = await LearningMaterial.findByIdAndDelete(id);

    if (!deletedLearningMaterial) {
      return NextResponse.json({ success: false, error: 'Learning Material not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedLearningMaterial });
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
