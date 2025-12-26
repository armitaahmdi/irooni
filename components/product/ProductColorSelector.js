"use client";

import { Check } from "lucide-react";
import { getColorHex } from "@/utils/colorMap";

/**
 * ProductColorSelector Component
 * Color selection with stock availability
 */
export default function ProductColorSelector({
  product,
  selectedSize,
  selectedColor,
  onColorChange,
  getAvailableStockForSizeColor,
  getAvailableStockForColor,
  hoveredOutOfStockColor,
  setHoveredOutOfStockColor,
  showToast,
}) {
  if (!product || !product.colors || product.colors.length === 0) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {product.colors.map((color) => {
          const isSelected = selectedColor === color;
          const colorHex = getColorHex(color);
          const needsBorder =
            color === "سفید" ||
            color === "کرم" ||
            color === "بژ" ||
            color === "کرمی" ||
            color === "کرم روشن" ||
            color === "کرم تیره" ||
            color === "زرد کره ای";

          const availableStockForColor = selectedSize
            ? getAvailableStockForSizeColor(selectedSize, color)
            : getAvailableStockForColor(color);
          const stockValue = Math.floor(availableStockForColor);
          const isColorOutOfStock = stockValue <= 0;

          return (
            <div
              key={color}
              className={`relative ${isColorOutOfStock ? "group" : ""}`}
              onMouseEnter={() => {
                if (isColorOutOfStock) {
                  setHoveredOutOfStockColor(color);
                }
              }}
              onMouseLeave={() => {
                if (isColorOutOfStock) {
                  setHoveredOutOfStockColor(null);
                }
              }}
            >
              <button
                onClick={() => {
                  if (isColorOutOfStock) {
                    showToast("اتمام موجودی", "error");
                  } else {
                    onColorChange(color);
                  }
                }}
                disabled={isColorOutOfStock}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all ${
                  isSelected
                    ? "ring-3 sm:ring-4 ring-[#286378] ring-offset-2 sm:ring-offset-2 scale-110 shadow-lg"
                    : isColorOutOfStock
                    ? "cursor-not-allowed opacity-50"
                    : "hover:scale-105 active:scale-95"
                }`}
                style={{
                  backgroundColor: colorHex,
                  border: needsBorder ? "2px solid #E5E7EB" : "none",
                }}
                title={!isColorOutOfStock ? color : ""}
              >
                {isSelected && !isColorOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white drop-shadow-lg" />
                  </div>
                )}
              </button>
              {/* Tooltip فقط برای رنگ‌های تمام شده */}
              {isColorOutOfStock && hoveredOutOfStockColor === color && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg min-w-[120px] text-center">
                  اتمام موجودی
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

