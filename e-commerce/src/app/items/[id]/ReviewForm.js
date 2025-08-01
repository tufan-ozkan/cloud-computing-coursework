'use client';

import { useState, useEffect } from "react";
import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline';

export default function ReviewForm({ itemId }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  const submitReview = async () => {
    const res = await fetch(`/api/items/${itemId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ Rating: rating, Body: body }),
    });

    if (res.ok) {
      setSubmitted(true);
      window.location.reload();
    }
  };

  const handleClick = (index) => setRating(index);
  const handleHover = (index) => setHoverRating(index);
  const getFill = (index) =>
    hoverRating >= index || (!hoverRating && rating >= index);

  if (!token)
    return (
      <p className="mt-6 text-red-600 text-center text-base font-medium">
        Please log in to leave a review.
      </p>
    );

  if (submitted)
    return (
      <p className="mt-6 text-green-600 text-center text-base font-medium">
        Review submitted!
      </p>
    );

  return (
    <div className="mt-6 bg-white p-5 rounded-xl shadow-md border">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Leave a Review</h2>

      {/* Star Rating */}
      <div className="flex items-center mb-4 flex-wrap gap-1">
        {[...Array(10)].map((_, i) => {
          const index = i + 1;
          const Filled = getFill(index);
          const Icon = Filled ? SolidStarIcon : OutlineStarIcon;

          return (
            <Icon
              key={i}
              className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                Filled ? 'text-yellow-400' : 'text-gray-300'
              }`}
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={() => setHoverRating(0)}
            />
          );
        })}
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {rating}/10
        </span>
      </div>

      {/* Textarea */}
      <textarea
        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Share your thoughts..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
      />

      {/* Submit Button */}
      <button
        onClick={submitReview}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors w-full sm:w-auto"
      >
        Submit Review
      </button>
    </div>
  );
}
