import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MongoDB URI is not defined in environment variables.");
        }
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error:", error.message);
    }
};

export default connectMongoDB;
