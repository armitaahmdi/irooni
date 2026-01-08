"use client";

import { ChevronDown, ChevronUp, Ruler } from "lucide-react";

/**
 * SizeFilter Component
 * Size selection filter
 */
export default function SizeFilter({
  availableSizes,
  selectedSize,
  setSelectedSize,
  expandedFilters,
  toggleFilterSection,
}) {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200/60">
      <button
        onClick={() => toggleFilterSection("size")}
        className="w-full flex items-center justify-between text-sm font-bold text-gray-800 mb-4 hover:text-[#286378] transition-all duration-200 group py-1"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-[#286378]/10 transition-all duration-200">
            <Ruler className="w-4 h-4 text-gray-500 group-hover:text-[#286378] transition-colors" />
          </div>
          <span>سایز</span>
        </div>
        {expandedFilters.size ? (
          <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-[#286378] transition-all duration-200" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#286378] transition-all duration-200" />
        )}
      </button>
      {expandedFilters.size && (
        <div className="flex flex-wrap gap-2 sm:gap-2.5 pl-8 sm:pl-11">
          {availableSizes.length > 0 ? (
            availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedSize === size
                    ? "bg-gradient-to-br from-[#286378] to-[#43909A] text-white shadow-lg shadow-[#286378]/40 scale-105 transform"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-[#286378]/40 hover:shadow-md hover:scale-105"
                }`}
              >
                {size}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">در حال بارگذاری سایزها...</p>
          )}
        </div>
      )}
    </div>
  );
}

