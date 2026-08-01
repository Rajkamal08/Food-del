import express from "express";
import { loginUser, registerUser, addAddress, getAddresses } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Protected routes
userRouter.post("/address/add", authMiddleware, addAddress);
userRouter.get("/address/list", authMiddleware, getAddresses);

export default userRouter;
