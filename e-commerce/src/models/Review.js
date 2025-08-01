import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
  },
  Item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  Body: {
    type: String,
    required: true,
  },
  Rating: {
    type: Number,
    required: true,
  },
});

export const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
