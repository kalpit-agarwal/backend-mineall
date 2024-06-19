import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const DB = process.env.DATABASE;

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("MongoDB is connected");
  } catch (err) {
    console.log("FAILED TO CONNECT TO MONGO DB", err);
  }
};

export default connectDB;
