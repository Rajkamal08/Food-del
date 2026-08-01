import express from "express";
import {
  addFood,
  listFood,
  removeFood,
} from "../controllers/foodController.js";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import adminAuth from "../middleware/adminAuth.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//Image Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'food_del_uploads',
    allowed_formats: ['jpg', 'png'],
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});
const upload = multer({ storage: storage });
const foodRouter = express.Router();
foodRouter.post("/add", adminAuth, upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", adminAuth, removeFood);

export default foodRouter;
