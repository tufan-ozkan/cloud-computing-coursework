import { connectDb } from "@/lib/db";
import { Item } from "@/models/Item";
import { Review } from "@/models/Review";
import { User } from "@/models/User";
import mongoose from "mongoose";
import { withAuth } from "@/lib/withAuth";

// GET /api/items/[id] - get single item
export async function GET(_, { params }) {
  const { id } = params;

  await connectDb();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  const item = await Item.findById(id)
    .populate("Reviews")
    .populate("Seller", "username")
    .lean();

  if (!item) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  return Response.json(item);
}

// DELETE /api/items/[id] - admin only
export const DELETE = withAuth(async (_, { params }) => {
  await connectDb();

  const item = await Item.findById(params.id);
  if (!item) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  // Delete associated reviews
  await Review.deleteMany({ Item: item._id });

  // Delete the item
  await Item.deleteOne({ _id: item._id });

  return Response.json({ message: "Item deleted" });
}, true); // true = require admin
