import mongoose from "mongoose";

let client = null;
let bucket = null;

const MONGODB_URI = "mongodb+srv://blacandbloo:jnijdnsfnjMLKNDVJKSfdfs3434@moneyversityai.ut7dw3f.mongodb.net/Moneyversity?retryWrites=true&w=majority&appName=MoneyversityAI";

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
