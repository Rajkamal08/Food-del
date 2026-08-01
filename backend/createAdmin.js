import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import userModel from "./models/userModel.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://rajkamal_15_12:rajkamal_15_12@cluster0.hrc6k.mongodb.net/food-del");
    console.log("Connected to MongoDB.");

    const email = "admin@feastflow.com";
    const password = "AdminPassword123!"; // Change this later

    const existingAdmin = await userModel.findOne({ email });
    if (existingAdmin) {
      console.log("Admin account already exists!");
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new userModel({
      name: "Super Admin",
      email: email,
      password: hashedPassword,
      role: "Admin",
    });

    await newAdmin.save();
    console.log("✅ Admin account created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

seedAdmin();
