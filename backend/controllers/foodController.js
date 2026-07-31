import foodModel from "../models/foodModel.js";
import fs from "fs";
import { v2 as cloudinary } from 'cloudinary';

const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    let image_url = req.file.path;
    let image_public_id = req.file.filename;

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_url,
      image_public_id: image_public_id,
    });

    const savedFood = await food.save();

    res.status(201).json({
      success: true,
      message: "Food added successfully",
      food: savedFood,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error adding food", error });
  }
};

// all food list

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//remove food item

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (food.image_public_id) {
      await cloudinary.uploader.destroy(food.image_public_id);
    } else {
      fs.unlink(`uploads/${food.image}`, () => {});
    }
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
export { addFood, listFood, removeFood };
