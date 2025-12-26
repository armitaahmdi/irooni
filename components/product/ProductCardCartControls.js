"use client";

import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Loader2,
} from "lucide-react";

/**
 * ProductCardCartControls Component
 * Cart controls for product card (add, increase, decrease, remove)
 */
export default function ProductCardCartControls({
  isInCart,
  cartQuantity,
  isCartProcessing,
  availableStock,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveFromCart,
}) {
  if (!isInCart) {
    return (
      <button
        onClick={onAddToCart}
        disabled={isCartProcessing || availableStock < 1}
        className="group/btn relative w-full font-bold py-2.5 sm:py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
      >
        {/* Default Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#286378] via-[#3A7A85] to-[#43909A] rounded-xl transition-opacity duration-300 group-hover/card:opacity-0"></div>

        {/* Yellow Background on Card Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD60A] to-[#FFC107] rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 z-20"></div>

        {/* Text - Default State */}
        <span className="relative z-10 inline-block transition-all duration-300 text-white group-hover/card:-translate-y-full group-hover/card:opacity-0">
          {isCartProcessing ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mx-auto" />
          ) : (
            "افزودن به سبد"
          )}
        </span>

        {/* Icon - Hover State */}
        <span className="absolute inset-0 z-10 flex items-center justify-center transition-all duration-300 translate-y-full opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100">
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-[#2F2F2F]" />
        </span>
      </button>
    );
  }

  if (cartQuantity === 1) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={onRemoveFromCart}
          disabled={isCartProcessing}
          className="flex-1 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2.5 sm:py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          title="حذف از سبد خرید"
        >
          {isCartProcessing ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
        <button
          onClick={onIncreaseQuantity}
          disabled={isCartProcessing || cartQuantity >= availableStock}
          className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#286378] via-[#3A7A85] to-[#43909A] hover:from-[#43909A] hover:to-[#286378] text-white font-bold py-2.5 sm:py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          title="افزودن"
        >
          {isCartProcessing ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecreaseQuantity}
        disabled={isCartProcessing}
        className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed"
        title="کاهش"
      >
        {isCartProcessing ? (
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
        ) : (
          <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl py-2.5 sm:py-3 font-bold text-gray-900 shadow-sm">
        <span className="text-base sm:text-lg">{cartQuantity}</span>
      </div>
      <button
        onClick={onIncreaseQuantity}
        disabled={isCartProcessing || cartQuantity >= availableStock}
        className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#286378] via-[#3A7A85] to-[#43909A] hover:from-[#43909A] hover:to-[#286378] text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed"
        title="افزایش"
      >
        {isCartProcessing ? (
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
        ) : (
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>
    </div>
  );
}

