import { connectDb } from "@/lib/db";
import { Item } from "@/models/Item";
import { Review } from "@/models/Review";
import { User } from "@/models/User";

import ReviewForm from "./ReviewForm";

export default async function ItemDetailPage({ params }) {
  await connectDb();
  const item = await Item.findById(params.id)
    .populate({
      path: "Reviews",
      populate: { path: "User", select: "UserName" },
    })
    .lean();

  const formatRating = (rating) =>
    rating ? `${parseFloat(rating).toFixed(2)} ★` : "N/A";

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-4 text-center">{item.Name}</h1>

      {item.Image && (
        <div className="mb-6">
          <img
            src={item.Image}
            alt={item.Name}
            className="w-full max-h-[500px] object-contain rounded-xl shadow-md border"
          />
        </div>
      )}

      <div className="text-center space-y-2 mb-8">
        <p className="text-sm uppercase tracking-wide text-gray-500">{item.Category}</p>
        <p className="text-2xl font-bold text-green-600">${item.Price}</p>
        {item.Rating && (
          <p className="text-lg text-yellow-600 font-medium">
            Rating: {formatRating(item.Rating)}
          </p>
        )}
      </div>

      <div className="space-y-3 text-lg bg-gray-50 p-5 rounded-xl shadow-sm">
        {item.Description && <p>{item.Description}</p>}
        {item.Material && <p><strong>Material:</strong> {item.Material}</p>}
        {item.Size && <p><strong>Size:</strong> {item.Size}</p>}
        {item.BatteryLife && <p><strong>Battery Life:</strong> {item.BatteryLife}</p>}
        {item.Age && <p><strong>Age:</strong> {item.Age}</p>}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Reviews</h2>
        {item.Reviews.length === 0 ? (
          <p className="text-gray-600 italic">No reviews yet.</p>
        ) : (
          item.Reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-4 rounded-xl shadow-sm border mb-4"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold">{review.User?.UserName}</p>
                <span className="text-yellow-600 font-medium">
                  {parseFloat(review.Rating).toFixed(2)} ★
                </span>
              </div>
              <p className="text-gray-700">{review.Body}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-10">
        <ReviewForm itemId={params.id} />
      </div>
    </main>
  );
}
