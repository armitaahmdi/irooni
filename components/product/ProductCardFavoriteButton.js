"use client";

import { Heart } from "lucide-react";

/**
 * ProductCardFavoriteButton Component
 * Favorite button for product card
 */
export default function ProductCardFavoriteButton({
  isLiked,
  onToggleFavorite,
}) {
  return (
      <button
        onClick={onToggleFavorite}
        className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 overflow-hidden ${
          isLiked
            ? "bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 border-2 border-red-400"
            : "bg-white/95 text-gray-700 hover:bg-white border border-gray-200"
        }`}
      >
        {/* Pulse effect when liked */}
        {isLiked && (
          <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
        )}
        <Heart
          className={`relative z-10 w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
            isLiked ? "fill-current scale-110" : "group-hover:scale-110"
          }`}
        />
      </button>
  );
}

