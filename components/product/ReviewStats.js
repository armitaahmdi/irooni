"use client";

import { Star } from "lucide-react";

/**
 * ReviewStats Component
 * Displays review statistics
 */
export default function ReviewStats({ stats, renderStars }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="text-center md:text-right">
          <div className="text-5xl font-extrabold text-[#286378] mb-2">
            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "0.0"}
          </div>
          <div className="flex justify-center md:justify-start mb-2">{renderStars(Math.round(stats.averageRating))}</div>
          <p className="text-sm text-gray-600">بر اساس {stats.totalRatings} نظر</p>
        </div>

        <div className="flex-1 w-full">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingDistribution[rating] || 0;
              const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-left">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

