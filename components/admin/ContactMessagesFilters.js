"use client";

import { Search, Mail } from "lucide-react";

/**
 * ContactMessagesFilters Component
 * Filters and search for contact messages
 */
export default function ContactMessagesFilters({
  searchQuery,
  setSearchQuery,
  filterRead,
  setFilterRead,
  messages,
  unreadCount,
  onFilterChange,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="جستجوی پیام‌ها..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onFilterChange) onFilterChange();
            }}
            className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378] focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFilterRead("all");
              if (onFilterChange) onFilterChange();
            }}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              filterRead === "all"
                ? "bg-[#286378] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            همه ({messages.length})
          </button>
          <button
            onClick={() => {
              setFilterRead("unread");
              if (onFilterChange) onFilterChange();
            }}
            className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              filterRead === "unread"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Mail className="w-4 h-4" />
            خوانده نشده ({unreadCount})
          </button>
          <button
            onClick={() => {
              setFilterRead("read");
              if (onFilterChange) onFilterChange();
            }}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              filterRead === "read"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            خوانده شده
          </button>
        </div>
      </div>
    </div>
  );
}

