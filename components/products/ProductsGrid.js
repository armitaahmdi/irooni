"use client";

import ProductCard from "../ProductCard";
import { Loader2, SlidersHorizontal } from "lucide-react";

/**
 * ProductsGrid Component
 * Displays products in grid or list view
 */
export default function ProductsGrid({
  products,
  isLoading,
  viewMode,
  onClearFilters,
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#286378] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری محصولات...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <SlidersHorizontal className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">محصولی یافت نشد</h3>
        <p className="text-gray-600 mb-6">لطفاً فیلترهای خود را تغییر دهید</p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-6 py-2 bg-[#286378] text-white rounded-lg hover:bg-[#43909A] transition-colors font-medium"
          >
            پاک کردن فیلترها
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6"
          : "space-y-3 sm:space-y-4"
      }
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

