"use client";

import { Package, Ruler, Palette, Folder, X } from "lucide-react";
import { productCategories } from "@/data/categories";

/**
 * ActiveFilters Component
 * Display active filter tags
 */
export default function ActiveFilters({
  inStock,
  setInStock,
  onSale,
  setOnSale,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
}) {
  const hasActiveFilters =
    inStock || onSale || selectedSize || selectedColor || selectedCategoryFilter;

  if (!hasActiveFilters) return null;

  return (
    <div className="mb-6 pb-6 border-b border-gray-200/60">
      <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
        <div className="w-1 h-4 bg-gradient-to-b from-[#286378] to-[#43909A] rounded-full"></div>
        فیلترهای فعال
      </p>
      <div className="flex flex-wrap gap-2.5">
        {inStock && (
          <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-[#286378]/10 to-[#286378]/5 text-[#286378] text-xs font-semibold rounded-xl border border-[#286378]/20 shadow-sm hover:shadow-md transition-all duration-200">
            <Package className="w-3.5 h-3.5" />
            موجود
            <button
              onClick={() => setInStock(false)}
              className="hover:bg-[#286378]/20 rounded-full p-0.5 transition-all duration-200 hover:scale-110"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}
        {onSale && (
          <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-red-50 to-red-50/50 text-red-600 text-xs font-semibold rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-all duration-200">
            <span className="text-sm font-bold">%</span>
            تخفیف دار
            <button
              onClick={() => setOnSale(false)}
              className="hover:bg-red-100 rounded-full p-0.5 transition-all duration-200 hover:scale-110"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}
        {selectedSize && (
          <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-600 text-xs font-semibold rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
            <Ruler className="w-3.5 h-3.5" />
            {selectedSize}
            <button
              onClick={() => setSelectedSize("")}
              className="hover:bg-blue-100 rounded-full p-0.5 transition-all duration-200 hover:scale-110"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}
        {selectedColor && (
          <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-purple-50 to-purple-50/50 text-purple-600 text-xs font-semibold rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200">
            <Palette className="w-3.5 h-3.5" />
            {selectedColor}
            <button
              onClick={() => setSelectedColor("")}
              className="hover:bg-purple-100 rounded-full p-0.5 transition-all duration-200 hover:scale-110"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}
        {selectedCategoryFilter && (
          <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-green-50 to-green-50/50 text-green-600 text-xs font-semibold rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
            <Folder className="w-3.5 h-3.5" />
            {productCategories.find((cat) => cat.slug === selectedCategoryFilter)?.name ||
              selectedCategoryFilter}
            <button
              onClick={() => setSelectedCategoryFilter("")}
              className="hover:bg-green-100 rounded-full p-0.5 transition-all duration-200 hover:scale-110"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

