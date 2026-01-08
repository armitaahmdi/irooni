"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";

/**
 * CollapsibleBreadcrumb Component
 * Mobile breadcrumb with expand/collapse button
 */
export default function CollapsibleBreadcrumb({ 
  items = [], 
  showHome = true,
  homeLabel = "خانه"
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const allItems = showHome 
    ? [{ label: homeLabel, href: "/" }, ...items]
    : items;

  if (allItems.length === 0) return null;

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Breadcrumb items */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-600 flex-1 min-w-0 overflow-x-auto">
            {allItems.map((item, index) => {
              const isLast = index === allItems.length - 1;
              const isLink = item.href && !isLast;
              const shouldShow = isExpanded || index === 0 || isLast || allItems.length <= 2;

              if (!shouldShow && !isExpanded) {
                if (index === 1) {
                  return (
                    <div key="ellipsis" className="flex items-center gap-1.5">
                      <ChevronLeft className="w-3 h-3 flex-shrink-0" />
                      <span className="text-gray-400">...</span>
                    </div>
                  );
                }
                return null;
              }

              return (
                <div key={index} className="flex items-center gap-1.5 flex-shrink-0">
                  {isLink ? (
                    <Link 
                      href={item.href} 
                      className="hover:text-[#286378] transition-colors whitespace-nowrap"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={`whitespace-nowrap ${isLast ? "text-[#286378] font-semibold" : ""}`}>
                      {item.label}
                    </span>
                  )}
                  {!isLast && (
                    <ChevronLeft className="w-3 h-3 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Expand/Collapse Button */}
          {allItems.length > 2 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors ml-2"
              aria-label={isExpanded ? "بستن" : "باز کردن"}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

