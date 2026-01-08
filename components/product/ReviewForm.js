"use client";

import { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";

/**
 * ReviewForm Component
 * Form for submitting a new review
 */
export default function ReviewForm({ onSubmit, onCancel, isSubmitting }) {
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: "",
    comment: "",
  });

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={interactive ? "cursor-pointer" : ""}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              } ${interactive ? "hover:scale-110 transition-transform" : ""}`}
            />
          </button>
        ))}
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onSubmit(reviewForm);
    if (success) {
      setReviewForm({ rating: 0, title: "", comment: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4">ثبت نظر شما</h3>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          امتیاز شما <span className="text-red-500">*</span>
        </label>
        {renderStars(reviewForm.rating, true, (rating) =>
          setReviewForm({ ...reviewForm, rating })
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          عنوان نظر (اختیاری)
        </label>
        <input
          type="text"
          value={reviewForm.title}
          onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378]"
          placeholder="عنوان نظر خود را بنویسید"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          نظر شما (اختیاری)
        </label>
        <textarea
          value={reviewForm.comment}
          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378] resize-none"
          placeholder="نظر خود را اینجا بنویسید..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 bg-gradient-to-r from-[#286378] to-[#43909A] text-white font-bold rounded-xl hover:from-[#43909A] hover:to-[#286378] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              در حال ارسال...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              ارسال نظر
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setReviewForm({ rating: 0, title: "", comment: "" });
            onCancel();
          }}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}

