"use client";

import { ChevronDown, ChevronUp, Folder } from "lucide-react";
import { productCategories } from "@/data/categories";

/**
 * CategoryFilter Component
 * Category selection filter
 */
export default function CategoryFilter({
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  expandedFilters,
  toggleFilterSection,
}) {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200/60">
      <button
        onClick={() => toggleFilterSection("category")}
        className="w-full flex items-center justify-between text-sm font-bold text-gray-800 mb-4 hover:text-[#286378] transition-all duration-200 group py-1"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-[#286378]/10 transition-all duration-200">
            <Folder className="w-4 h-4 text-gray-500 group-hover:text-[#286378] transition-colors" />
          </div>
          <span>دسته‌بندی</span>
        </div>
        {expandedFilters.category ? (
          <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-[#286378] transition-all duration-200" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#286378] transition-all duration-200" />
        )}
      </button>
      {expandedFilters.category && (
        <div className="space-y-2 pl-11">
          <button
            onClick={() => setSelectedCategoryFilter("")}
            className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              !selectedCategoryFilter
                ? "bg-gradient-to-br from-[#286378] to-[#43909A] text-white shadow-lg shadow-[#286378]/40"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-[#286378]/40 hover:shadow-sm"
            }`}
          >
            همه دسته‌بندی‌ها
          </button>
          {productCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() =>
                setSelectedCategoryFilter(
                  selectedCategoryFilter === category.slug ? "" : category.slug
                )
              }
              className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                selectedCategoryFilter === category.slug
                  ? "bg-gradient-to-br from-[#286378] to-[#43909A] text-white shadow-lg shadow-[#286378]/40"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-[#286378]/40 hover:shadow-sm"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

