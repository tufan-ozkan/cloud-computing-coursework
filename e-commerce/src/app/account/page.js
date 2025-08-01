import { connectDb } from "@/lib/db";
import { User } from "@/models/User";
import { Review } from "@/models/Review";
import { Item } from "@/models/Item";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export default async function AccountPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <main className="p-6 text-red-600">
        <h1 className="text-xl font-bold">Unauthorized</h1>
        <p>Please login to view your profile.</p>
      </main>
    );
  }

  let user;
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    await connectDb();

    user = await User.findById(userId)
      .populate({
        path: "Reviews",
        model: "Review"
      })
      .lean();

    // Also get item names for each review
    for (let review of user.Reviews) {
      const item = await Item.findById(review.Item).lean();
      review.ItemName = item?.Name || "Deleted Item";
    }

  } catch (err) {
    console.error(err);
    return (
      <main className="p-6 text-red-600">
        <h1 className="text-xl font-bold">Error</h1>
        <p>Failed to load profile.</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.UserName} !</h1>

      <p className="text-gray-600 mb-4">
        <strong>Average Rating:</strong> {user.AverageRating.toFixed(2)}
      </p>

      <div>
        <h2 className="text-lg font-semibold mb-2">Your Reviews</h2>

        {user.Reviews.length === 0 ? (
          <p className="text-gray-500">You haven’t left any reviews yet.</p>
        ) : (
          user.Reviews.map((review) => (
            <div key={review._id} className="border-t pt-2 mt-2">
              <p className="text-sm text-gray-600 mb-1">
                <strong>Item:</strong> {review.ItemName}
              </p>
              <p className="text-sm">⭐ {review.Rating}/10</p>
              <p>{review.Body}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
