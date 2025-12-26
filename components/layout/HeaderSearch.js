"use client";

import { SearchIcon } from "lucide-react";
import SearchAutocomplete from "@/components/SearchAutocomplete";

/**
 * HeaderSearch Component
 * Search input with autocomplete
 */
export default function HeaderSearch({
  searchQuery,
  setSearchQuery,
  onSearch,
  onKeyPress,
  isMobile = false,
  placeholder = "جستجوی محصولات",
}) {
  if (isMobile) {
    return (
      <div className="relative w-full">
        <div className="relative group">
          <SearchIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#286378] transition-colors z-10" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={onKeyPress}
            className="w-full pr-8 pl-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#286378] focus:shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearch(searchQuery, true)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-[#286378] text-white rounded-md hover:bg-[#43909A] transition-colors z-10"
              aria-label="جستجو"
            >
              <SearchIcon className="w-3 h-3" />
            </button>
          )}
          <SearchAutocomplete
            query={searchQuery}
            onSelect={() => {
              setSearchQuery("");
            }}
            isMobile={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-1 max-w-2xl">
      <div className="relative w-full">
        <div className="flex flex-row items-center w-full bg-white rounded-xl shadow-sm border border-gray-200 focus-within:border-[#286378] focus-within:shadow-md transition-all duration-300 px-4 py-3">
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={onKeyPress}
            className="w-full pr-3 pl-3 py-1 bg-transparent text-sm focus:outline-none text-gray-700 placeholder-gray-400 transition-all"
          />
          <button
            onClick={() => searchQuery && onSearch(searchQuery, false)}
            className="mr-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors flex-shrink-0"
            aria-label="جستجو"
          >
            <SearchIcon className="w-4 h-4" />
          </button>
        </div>
        <SearchAutocomplete
          query={searchQuery}
          onSelect={() => setSearchQuery("")}
          isMobile={false}
        />
      </div>
    </div>
  );
}

