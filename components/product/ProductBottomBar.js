"use client";

import { ShoppingBag, Loader2, Trash2 } from "lucide-react";

const formatPrice = (value) => new Intl.NumberFormat("fa-IR").format(value) + " تومان";

/**
 * ProductBottomBar Component
 * Fixed bottom bar with price and add to cart button - Mobile only
 * Exact match with the image design
 */
export default function ProductBottomBar({
  product,
  selectedSize,
  selectedColor,
  isInCart,
  cartQuantity,
  isCartProcessing,
  getAvailableStockForSizeColor,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveFromCart,
}) {
  if (!product) return null;

  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const finalPrice = hasDiscount 
    ? product.price 
    : product.originalPrice || product.price;

  const canAddToCart = 
    product.inStock &&
    selectedSize &&
    selectedColor &&
    !isCartProcessing &&
    getAvailableStockForSizeColor(selectedSize, selectedColor) >= 1;

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a4a5a] rounded-t-3xl shadow-2xl"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
      }}
    >
      <div className="flex items-center justify-between px-5 py-4">
        {/* Price - Right side (RTL) */}
        <div className="flex flex-col">
          <span className="text-white text-lg font-bold">
            {formatPrice(finalPrice)}
          </span>
          {hasDiscount && (
            <span className="text-white/70 text-xs line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button - Elevated with soft shadow, Left side (RTL) */}
        {!isInCart ? (
          <div className="relative">
            {/* Soft shadow/glow below button */}
            <div 
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-full h-8 rounded-full blur-xl opacity-60 -z-10"
              style={{
                background: "radial-gradient(ellipse, rgba(67, 144, 154, 0.5) 0%, transparent 70%)",
              }}
            ></div>
            
            <button
              onClick={onAddToCart}
              disabled={!canAddToCart}
              className="relative flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-br from-[#43909A] via-[#3A7A85] to-[#286378] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow: `
                  0 -6px 20px rgba(67, 144, 154, 0.45),
                  0 10px 32px rgba(0, 0, 0, 0.35),
                  0 4px 12px rgba(0, 0, 0, 0.3),
                  inset 0 2px 4px rgba(255, 255, 255, 0.25),
                  inset 0 -1px 2px rgba(0, 0, 0, 0.15)
                `,
              }}
            >
              {isCartProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="text-base font-semibold whitespace-nowrap">افزودن به سبد</span>
                  <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                </>
              )}
            </button>
          </div>
        ) : (
          <div 
            className="relative flex items-center gap-2 bg-white rounded-xl px-4 py-3.5"
            style={{
              boxShadow: `
                0 -4px 12px rgba(255, 255, 255, 0.4),
                0 10px 32px rgba(0, 0, 0, 0.3),
                0 4px 12px rgba(0, 0, 0, 0.25)
              `,
            }}
          >
            {cartQuantity === 1 ? (
              // When quantity is 1, show trash button instead of minus
              <button
                onClick={onRemoveFromCart}
                disabled={isCartProcessing}
                className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                title="حذف از سبد خرید"
              >
                {isCartProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            ) : (
              <button
                onClick={onDecreaseQuantity}
                disabled={isCartProcessing}
                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                title="کاهش"
              >
                {isCartProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-700" />
                ) : (
                  <span className="text-lg font-semibold text-gray-700">−</span>
                )}
              </button>
            )}
            <span className="w-12 text-center font-bold text-gray-900 text-lg">{cartQuantity}</span>
            <button
              onClick={onIncreaseQuantity}
              disabled={isCartProcessing || getAvailableStockForSizeColor(selectedSize, selectedColor) <= 0}
              className="w-9 h-9 flex items-center justify-center bg-[#286378] hover:bg-[#43909A] text-white rounded-lg transition-colors disabled:opacity-50"
              title="افزایش"
            >
              {isCartProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="text-lg font-semibold">+</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
