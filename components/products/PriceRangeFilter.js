"use client";

import { ChevronDown, ChevronUp, DollarSign } from "lucide-react";

/**
 * PriceRangeFilter Component
 * Price range slider filter
 */
export default function PriceRangeFilter({
  priceRange,
  setPriceRange,
  expandedFilters,
  toggleFilterSection,
}) {
  return (
    <div>
      <button
        onClick={() => toggleFilterSection("price")}
        className="w-full flex items-center justify-between text-sm font-bold text-gray-800 mb-4 hover:text-[#286378] transition-all duration-200 group py-1"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-[#286378]/10 transition-all duration-200">
            <DollarSign className="w-4 h-4 text-gray-500 group-hover:text-[#286378] transition-colors" />
          </div>
          <span>محدوده قیمت</span>
        </div>
        {expandedFilters.price ? (
          <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-[#286378] transition-all duration-200" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#286378] transition-all duration-200" />
        )}
      </button>
      {expandedFilters.price && (
        <div className="space-y-5 pl-11">
          <div className="relative pt-2">
            <input
              type="range"
              min="0"
              max="5000000"
              step="100000"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              className="w-full h-2.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#286378] shadow-inner"
              style={{
                background: `linear-gradient(to right, #286378 0%, #286378 ${(priceRange[1] / 5000000) * 100}%, #E5E7EB ${(priceRange[1] / 5000000) * 100}%, #E5E7EB 100%)`,
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                حداقل
              </p>
              <p className="text-sm font-bold text-gray-900">
                {new Intl.NumberFormat("fa-IR").format(priceRange[0])}{" "}
                <span className="text-xs text-gray-500 font-normal">تومان</span>
              </p>
            </div>
            <div className="text-gray-400 font-bold text-lg">-</div>
            <div className="flex-1 bg-gradient-to-br from-[#286378]/10 to-[#286378]/5 rounded-xl px-4 py-3 border-2 border-[#286378]/20 shadow-sm">
              <p className="text-xs font-semibold text-[#286378] mb-1 uppercase tracking-wide">
                حداکثر
              </p>
              <p className="text-sm font-bold text-[#286378]">
                {new Intl.NumberFormat("fa-IR").format(priceRange[1])}{" "}
                <span className="text-xs text-[#286378]/70 font-normal">تومان</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

