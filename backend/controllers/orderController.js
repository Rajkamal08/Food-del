import OrderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";
  try {
    // ✅ Use req.user.userId (from the auth middleware)
    const newOrder = new OrderModel({
      userId: req.user.userId, // FIXED HERE
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    // ✅ Update user cartData after successful order creation
    await userModel.findByIdAndUpdate(req.user.userId, { cartData: {} });

    // ✅ Prepare line_items for Stripe checkout
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Correct price calculation
      },
      quantity: item.quantity,
    }));

    // ✅ Add delivery charge
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100, // Correct calculation
      },
      quantity: 1,
    });

    // ✅ Fix template strings for success/cancel URLs
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await OrderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await OrderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "NOT Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: False, message: "error" });
  }
};

//USER ORDER FOR FRONTEND
const userOrders = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ Extract user ID from the token (not from the body)

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID missing from token",
      });
    }

    const orders = await OrderModel.find({ userId }); // ✅ Fetch user orders correctly
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// listing ordeeer for admin
const listOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
//api for updating order status
const updateStatus = async (req, res) => {
  try {
    await OrderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
