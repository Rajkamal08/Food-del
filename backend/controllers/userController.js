import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import validator from "validator";
import { response } from "express";

//login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't Exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
//register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    //checking is useer already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User Already Exists" });
    }
    //validating email format & strong Password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please Enter Valid Email " });
    }
    if (password.length < 6) {
      return res.json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Add address to user's address book
const addAddress = async (req, res) => {
  try {
    const { addressData } = req.body;
    const userId = req.body.userId; // injected by authMiddleware

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.addressBook.push(addressData);
    await user.save();
    
    res.json({ success: true, message: "Address saved!", data: user.addressBook });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error saving address" });
  }
};

// Get user's address book
const getAddresses = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user.addressBook });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching addresses" });
  }
};

export { loginUser, registerUser, addAddress, getAddresses };
