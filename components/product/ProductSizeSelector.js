"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

/**
 * ProductSizeSelector Component
 * Size selection with stock availability
 */
export default function ProductSizeSelector({
  product,
  selectedSize,
  onSizeChange,
  getAvailableStockForSize,
  hoveredOutOfStockSize,
  setHoveredOutOfStockSize,
  showToast,
}) {
  if (!product || !product.sizes || product.sizes.length === 0) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {product.sizes.map((size) => {
          const availableStock = getAvailableStockForSize(size);
          const stockValue = Math.floor(availableStock);
          const isOutOfStock = stockValue <= 0;

          return (
            <div
              key={size}
              className={`relative ${isOutOfStock ? "group" : ""}`}
              title={!isOutOfStock ? `موجودی: ${stockValue}` : ""}
              onMouseEnter={() => {
                if (isOutOfStock) {
                  setHoveredOutOfStockSize(size);
                }
              }}
              onMouseLeave={() => {
                if (isOutOfStock) {
                  setHoveredOutOfStockSize(null);
                }
              }}
            >
              <button
                onClick={() => {
                  if (isOutOfStock) {
                    showToast("اتمام موجودی", "error");
                  } else {
                    onSizeChange(size);
                  }
                }}
                disabled={isOutOfStock}
                className={`px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                  selectedSize === size
                    ? "bg-[#286378] text-white shadow-md scale-105"
                    : isOutOfStock
                    ? "bg-gray-50 text-gray-400 cursor-not-allowed opacity-50 border border-gray-200"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-[#286378] hover:bg-gray-100 active:scale-95"
                }`}
              >
                {size}
              </button>
              {/* Tooltip فقط برای سایزهای تمام شده */}
              {isOutOfStock && hoveredOutOfStockSize === size && (
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

