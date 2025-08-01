import { connectDb } from "@/lib/db";
import { Item } from "@/models/Item";
import { Review } from "@/models/Review";
import { User } from "@/models/User";
import { withAuth } from "@/lib/withAuth";
import mongoose from "mongoose";

export const POST = withAuth(async (req) => {
  const itemId = req.url.split("/api/items/")[1].split("/reviews")[0];
  const { Rating, Body } = await req.json();

  await connectDb();

  const item = await Item.findById(itemId).populate("Reviews");
  if (!item) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  const user = await User.findById(req.user.userId).populate("Reviews");

  // ✅ Check if user has already reviewed this item
  let review = await Review.findOne({ Item: item._id, User: user._id });

  if (review) {
    review.Rating = Rating;
    review.Body = Body;
    await review.save();
  } else {
    review = await Review.create({
      User: user._id,
      Item: item._id,
      Rating,
      Body,
    });

    // ✅ Add to item
    item.Reviews.push(review._id);

    // ✅ Add to user
    user.Reviews.push(review._id);
  }

  // ✅ Update average rating for item
  const allItemReviews = await Review.find({ Item: item._id });
  item.Rating = allItemReviews.reduce((sum, r) => sum + r.Rating, 0) / allItemReviews.length;

  // ✅ Update user's average rating
  const allUserReviews = await Review.find({ _id: { $in: user.Reviews } });
  user.AverageRating = allUserReviews.length
    ? allUserReviews.reduce((sum, r) => sum + r.Rating, 0) / allUserReviews.length
    : 0;

  await item.save();
  await user.save();

  return Response.json({ message: "Review submitted" });
});

export const DELETE = withAuth(async (_, { params }) => {
  const { itemId, reviewId } = params;
  await connectDb();

  console.log("🧼 DELETE /reviews triggered");
  console.log("📦 Review ID:", reviewId);
  console.log("📦 Item ID:", itemId);
  console.log("🧍 User ID:", _.user.userId);

  const review = await Review.findById(reviewId);
  if (!review) {
    console.error("❌ Review not found");
    return Response.json({ error: "Review not found" }, { status: 404 });
  }

  console.log("✅ Review found:", review);

  if (review.User.toString() !== _.user.userId) {
    console.warn("⚠️ Unauthorized deletion attempt");
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Remove review from item and user
  const itemUpdateRes = await Item.findByIdAndUpdate(review.Item, {
    $pull: { Reviews: review._id }
  });

  const userUpdateRes = await User.findByIdAndUpdate(review.User, {
    $pull: { Reviews: review._id }
  });

  console.log("🗑️ Removed review ref from item & user");

  // Delete review document
  await review.deleteOne();
  console.log("🧹 Review deleted");

  // Refresh item rating
  const item = await Item.findById(review.Item);
  if (!item) {
    console.error("❌ Item not found");
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  const remainingItemReviews = await Review.find({ Item: item._id });
  const totalRating = remainingItemReviews.reduce((sum, r) => sum + r.Rating, 0);
  const newItemRating = remainingItemReviews.length ? totalRating / remainingItemReviews.length : 0;

  item.Rating = newItemRating;
  await item.save();

  console.log("✅ Item rating recalculated and saved:", newItemRating);

  // Refresh user average rating
  const user = await User.findById(review.User);
  if (!user) {
    console.error("❌ User not found");
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const remainingUserReviews = await Review.find({ _id: { $in: user.Reviews } });
  const totalUserRating = remainingUserReviews.reduce((sum, r) => sum + r.Rating, 0);
  const newUserRating = remainingUserReviews.length
    ? totalUserRating / remainingUserReviews.length
    : 0;

  user.AverageRating = newUserRating;
  await user.save();

  console.log("✅ User average rating updated:", newUserRating);

  // Double-check: confirm final persisted rating
  const confirmItem = await Item.findById(item._id);
  console.log("🔁 DB Confirmed Rating:", confirmItem.Rating);

  return Response.json({ message: "Review deleted and ratings updated." });
});
