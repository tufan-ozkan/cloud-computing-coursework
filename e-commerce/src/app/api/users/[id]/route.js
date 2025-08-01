import { connectDb } from "@/lib/db";
import { User } from "@/models/User";
import { Item } from "@/models/Item";
import { Review } from "@/models/Review";
import { withAuth } from "@/lib/withAuth";

export const DELETE = withAuth(async (_, { params }) => {
  await connectDb();
  const user = await User.findById(params.id);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  // Clean up: remove user reviews + items
  await Review.deleteMany({ User: user._id });
  await Item.deleteMany({ Seller: user._id });
  await User.deleteOne({ _id: user._id });

  return Response.json({ message: "User deleted" });
}, true); // admin only
