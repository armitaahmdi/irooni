"use client";

import { Grid3x3, List } from "lucide-react";

/**
 * ProductsToolbar Component
 * Toolbar for sorting and view mode selection
 */
export default function ProductsToolbar({
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  setCurrentPage,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        {/* Sort */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">مرتب‌سازی:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#286378] transition-colors text-xs sm:text-sm"
          >
            <option value="newest">جدیدترین</option>
            <option value="price-low">ارزان‌ترین</option>
            <option value="price-high">گران‌ترین</option>
          </select>
        </div>

        {/* View Mode */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-[#286378] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-[#286378] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <List className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

