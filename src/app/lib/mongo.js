import mongoose from "mongoose";

let client = null;
let bucket = null;

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

async function connectMongoDB() {
    if (client) {
        return { client, bucket };
    }

    await mongoose.connect(MONGODB_URI);

    client = mongoose.connection;

    const db = mongoose.connection;
    bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "uploads",
    });

    console.log("Connected to the Database");
    return { client, bucket };
}

export default connectMongoDB;
