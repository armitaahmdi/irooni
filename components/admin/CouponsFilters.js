"use client";

import { Search } from "lucide-react";

/**
 * CouponsFilters Component
 * Search and filter controls for coupons
 */
export default function CouponsFilters({
  searchQuery,
  setSearchQuery,
  filterActive,
  setFilterActive,
  onSearchChange,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col md:flex-row items-center gap-4">
      <div className="relative flex-1 w-full md:w-auto">
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="جستجو در کدهای تخفیف..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (onSearchChange) onSearchChange();
          }}
          className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378] focus:border-transparent"
        />
      </div>

      <div className="flex-shrink-0 w-full md:w-auto">
        <select
          value={filterActive}
          onChange={(e) => {
            setFilterActive(e.target.value);
            if (onSearchChange) onSearchChange();
          }}
          className="w-full md:w-48 px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#286378] focus:border-transparent"
        >
          <option value="all">همه کدها</option>
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
        </select>
      </div>
    </div>
  );
}

