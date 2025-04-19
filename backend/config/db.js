import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if MongoDB is unavailable
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      autoIndex: true, // Automatically build indexes
    });
    console.log(" Database Connected");
  } catch (error) {
    console.error(" Database Connection Error:", error.message);
    process.exit(1);
  }
};
