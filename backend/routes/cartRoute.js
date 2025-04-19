import express from "express";
import cartController from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, cartController.addToCart);
cartRouter.post("/remove", authMiddleware, cartController.removeFromCart);
cartRouter.post("/get", authMiddleware, cartController.getCart);

export default cartRouter;
