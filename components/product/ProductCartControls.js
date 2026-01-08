"use client";

import { ShoppingCart, Heart, Share2, Minus, Plus, Trash2, AlertCircle, Loader2 } from "lucide-react";

/**
 * ProductCartControls Component
 * Handles add to cart, quantity controls, favorite, and share
 */
export default function ProductCartControls({
  product,
  selectedSize,
  selectedColor,
  isInCart,
  cartQuantity,
  isCartProcessing,
  isLiked,
  getAvailableStockForSizeColor,
  getAvailableStockForColor,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveFromCart,
  onToggleFavorite,
  onShare,
}) {
  if (!product) return null;

  return (
    <div className="space-y-3 pt-3 sm:pt-4 border-t border-gray-200">
      {/* Cart Controls */}
      {!isInCart ? (
        <button
          onClick={onAddToCart}
          disabled={
            !product.inStock ||
            !selectedSize ||
            !selectedColor ||
            isCartProcessing ||
            getAvailableStockForSizeColor(selectedSize, selectedColor) < 1
          }
          className="group/btn relative w-full font-semibold py-3 sm:py-3.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
        >
          {/* Default Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#286378] to-[#43909A] rounded-lg transition-opacity duration-300 group-hover:opacity-0 group-hover/btn:opacity-0"></div>

          {/* Yellow Background on Card or Button Hover */}
          <div className="absolute inset-0 bg-[#FFD60A] rounded-lg opacity-0 group-hover:opacity-100 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 z-20"></div>

          {/* Text - Default State */}
          <span className="relative z-10 inline-block transition-all duration-300 text-white group-hover/btn:-translate-y-full group-hover/btn:opacity-0">
            {isCartProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              "افزودن به سبد"
            )}
          </span>

          {/* Icon - Hover State */}
          <span className="absolute inset-0 z-10 flex items-center justify-center transition-all duration-300 translate-y-full opacity-0 group-hover/btn:translate-y-0 group-hover/btn:opacity-100">
            <ShoppingCart className="w-4 h-4 text-[#2F2F2F]" />
          </span>
        </button>
      ) : (
        /* Cart Controls: Minus + Quantity + Plus */
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onDecreaseQuantity}
            disabled={isCartProcessing || cartQuantity <= 1}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed"
            title={cartQuantity <= 1 ? "برای حذف از سبد خرید از دکمه حذف استفاده کنید" : "کاهش"}
          >
            {isCartProcessing ? (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
            ) : (
              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <div className="flex-1 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg py-1.5 sm:py-2 font-semibold text-gray-900">
            <span className="text-sm sm:text-base">{cartQuantity}</span>
          </div>
          <button
            onClick={onIncreaseQuantity}
            disabled={isCartProcessing || getAvailableStockForSizeColor(selectedSize, selectedColor) <= 0}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-[#286378] to-[#43909A] hover:from-[#43909A] hover:to-[#286378] text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed"
            title="افزایش"
          >
            {isCartProcessing ? (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          {/* دکمه حذف برای زمانی که تعداد 1 است */}
          {cartQuantity === 1 && (
            <button
              onClick={onRemoveFromCart}
              disabled={isCartProcessing}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed"
              title="حذف از سبد خرید"
            >
              {isCartProcessing ? (
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          )}
        </div>
      )}

      {/* Stock Warnings */}
      {product.stock > 0 && product.stock < 5 && !selectedSize && !selectedColor && (
        <div className="flex items-center gap-1.5 sm:gap-2 text-orange-600 text-xs sm:text-sm bg-orange-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>موجودی در انبار: {product.stock} عدد</span>
        </div>
      )}

      {selectedSize && selectedColor && (() => {
        const availableStock = getAvailableStockForSizeColor(selectedSize, selectedColor);
        const stockValue = Math.floor(availableStock);
        return stockValue > 0 && stockValue < 5 ? (
          <div className="flex items-center gap-1.5 sm:gap-2 text-orange-600 text-xs sm:text-sm bg-orange-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>موجودی {selectedSize} {selectedColor}: {stockValue} عدد</span>
          </div>
        ) : stockValue <= 0 ? (
          <div className="flex items-center gap-1.5 sm:gap-2 text-red-600 text-xs sm:text-sm bg-red-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>اتمام موجودی {selectedSize} {selectedColor}</span>
          </div>
        ) : null;
      })()}

      {selectedColor && !selectedSize && (() => {
        const availableStockForColor = getAvailableStockForColor(selectedColor);
        const stockValue = Math.floor(availableStockForColor);
        return stockValue > 0 && stockValue < 5 ? (
          <div className="flex items-center gap-1.5 sm:gap-2 text-orange-600 text-xs sm:text-sm bg-orange-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>موجودی {selectedColor}: {stockValue} عدد</span>
          </div>
        ) : stockValue <= 0 ? (
          <div className="flex items-center gap-1.5 sm:gap-2 text-red-600 text-xs sm:text-sm bg-red-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>اتمام موجودی {selectedColor}</span>
          </div>
        ) : null;
      })()}

      {/* Favorite and Share */}
      <div className="flex gap-2 sm:gap-3">
        <button
          onClick={onToggleFavorite}
          className={`relative flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl font-bold transition-all text-xs sm:text-sm overflow-hidden ${
            isLiked
              ? "bg-gradient-to-br from-red-500 to-red-600 text-white border-2 border-red-400 shadow-md hover:shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent hover:border-gray-300"
          }`}
        >
          {/* Pulse effect when liked */}
          {isLiked && (
            <div className="absolute inset-0 bg-red-400 rounded-xl animate-ping opacity-75"></div>
          )}
          <Heart
            className={`relative z-10 w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
              isLiked ? "fill-current scale-110" : "hover:scale-110"
            }`}
          />
          <span className="relative z-10 hidden sm:inline">{isLiked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}</span>
          <span className="relative z-10 sm:hidden">{isLiked ? "حذف" : "افزودن"}</span>
        </button>
        <button
          onClick={onShare}
          className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg sm:rounded-xl transition-colors"
          title="اشتراک‌گذاری"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}

