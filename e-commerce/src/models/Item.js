import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Category: { type: String, required: true },
  Description: String,
  Price: { type: Number, required: true },
  Seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Image: String,
  Size: String,
  Material: String,
  BatteryLife: String,
  Age: String,
  Rating: {
    type: Number,
    default: 0,
  },
  Reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

export const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);
