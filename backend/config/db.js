import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const connectDB = async () => {
  const connectWithRetry = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
        socketTimeoutMS: 45000,          // Close sockets after 45 seconds of inactivity
        autoIndex: true,                 // Automatically build indexes
      });
      console.log("✅ Database Connected");
    } catch (error) {
      console.error("❌ Database Connection Error:", error.message);
      console.log("🔄 Retrying connection in 5 seconds...");
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds instead of crashing
    }
  };

  await connectWithRetry();
};
