"use client";

import { Search } from "lucide-react";
import { productCategories } from "@/data/categories";

/**
 * ProductsFilters Component
 * Search and category filter for products
 */
export default function ProductsFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onFilterChange,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="جستجوی محصول..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onFilterChange) onFilterChange();
            }}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            if (onFilterChange) onFilterChange();
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
        >
          <option value="">همه دسته‌بندی‌ها</option>
          {productCategories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

