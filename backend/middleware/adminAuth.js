import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const adminAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers["token"]; // Using the same header key as auth.js

  if (!token) {
    res.status(401);
    throw new Error("Not Authorized. Please Login Again");
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the user from the database to check their current role
    const user = await userModel.findById(token_decode.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User no longer exists");
    }

    if (user.role !== "Admin") {
      res.status(403);
      throw new Error("Access Denied: Admin role required");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(401);
      throw new Error("Invalid Token");
    }
    throw error;
  }
});

export default adminAuth;
