import userModel from "../models/userModel.js";
// add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ Get user ID from middleware
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ Get user ID from middleware
    let userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Romoved From Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ Extract from middleware
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};
    res.json({ success: true, cartData }); // ✅ Use 'cartData' instead of 'CartData'
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching cart" });
  }
};

export default { addToCart, removeFromCart, getCart };
