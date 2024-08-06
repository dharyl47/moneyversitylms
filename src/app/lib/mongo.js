
import mongoose from "mongoose";

const connectMongoDB = async () => {
    try{
        await mongoose.connect("mongodb+srv://blacandbloo:jnijdnsfnjMLKNDVJKSfdfs3434@moneyversityai.ut7dw3f.mongodb.net/Moneyversity?retryWrites=true&w=majority&appName=MoneyversityAI");
          console.log("Connected to MongoDB")
    } catch (Error) {
        console.log("Error")
    }
};

export default connectMongoDB;
