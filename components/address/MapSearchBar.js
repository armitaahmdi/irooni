"use client";

import { Search } from "lucide-react";

export default function MapSearchBar({
  searchInputRef,
  isSearching,
  searchResults,
  showSearchResults,
  onSearch,
  onSelectResult,
  onFocus,
}) {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        ref={searchInputRef}
        type="text"
        placeholder="جستجوی آدرس..."
        onChange={(e) => onSearch(e.target.value)}
        onFocus={onFocus}
        className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#286378] focus:ring-4 focus:ring-[#A2CFFF]/25 outline-none transition-all"
      />

      {showSearchResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
          {searchResults.map((result, index) => (
            <button
              key={index}
              onClick={() => onSelectResult(result)}
              className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <p className="font-medium text-gray-900">{result.title || result.address}</p>
              {result.address && result.title !== result.address && (
                <p className="text-sm text-gray-500 mt-1">{result.address}</p>
              )}
            </button>
          ))}
        </div>
      )}

      {isSearching && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-[#286378] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

