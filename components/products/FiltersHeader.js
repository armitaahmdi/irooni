"use client";

import { Filter, ChevronDown, ChevronUp, X } from "lucide-react";

/**
 * FiltersHeader Component
 * Header for filters sidebar with expand/collapse and clear buttons
 */
export default function FiltersHeader({
  isFiltersExpanded,
  setIsFiltersExpanded,
  activeFiltersCount,
  onClearFilters,
}) {
  return (
    <div
      onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
      className="w-full bg-gradient-to-br from-[#286378] via-[#2d7489] to-[#43909A] px-4 sm:px-6 py-4 sm:py-5 relative overflow-hidden hover:from-[#2d7489] hover:via-[#286378] transition-all duration-300 group cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-all duration-200">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-sm">فیلترها</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-white/30 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/20">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearFilters();
              }}
              className="text-xs text-white/95 hover:text-white font-semibold transition-all duration-200 flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg backdrop-blur-sm border border-white/20 hover:border-white/30"
            >
              <X className="w-3.5 h-3.5" />
              پاک کردن
            </button>
          )}
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-all duration-200">
            {isFiltersExpanded ? (
              <ChevronUp className="w-4 h-4 text-white" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

