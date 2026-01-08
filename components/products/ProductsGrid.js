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
      <div className="text-center py-12 sm:py-16 md:py-20 bg-white rounded-xl shadow-sm border border-gray-200 px-4">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse opacity-50"></div>
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full p-6 border-4 border-blue-100">
            <span className="text-5xl sm:text-6xl" role="img" aria-label="empty box">📦</span>
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">محصولی وجود ندارد</h3>
        <p className="text-base sm:text-lg text-gray-600 mb-2">در حال حاضر محصولی در این دسته‌بندی موجود نیست</p>
        <p className="text-sm sm:text-base text-gray-500 mb-8">لطفاً فیلترهای خود را تغییر دهید یا دسته‌بندی دیگری را انتخاب کنید</p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="min-h-[44px] px-6 sm:px-8 py-3 bg-gradient-to-r from-[#286378] to-[#43909A] text-white rounded-xl hover:from-[#43909A] hover:to-[#286378] transition-all duration-300 font-semibold shadow-md hover:shadow-lg active:scale-[0.98] text-base sm:text-lg"
            aria-label="پاک کردن تمام فیلترها و نمایش همه محصولات"
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

