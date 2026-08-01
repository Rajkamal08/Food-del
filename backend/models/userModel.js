import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cartData: {
      type: Object,
      default: {},
    },
    addressBook: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      enum: ['Customer', 'Admin'],
      default: 'Customer',
    },
  },
  { minimize: false }
);
const userModel = mongoose.models.user || mongoose.model("User", userSchema);
export default userModel;
