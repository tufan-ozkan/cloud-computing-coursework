import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  UserName: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Role: { type: String, default: "user" },
  AverageRating: { type: Number, default: 0 },
  Reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
});

// ✅ Auto-hash password on save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  this.Password = await bcrypt.hash(this.Password, 12);
  next();
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
