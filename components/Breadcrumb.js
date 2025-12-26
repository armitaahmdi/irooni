import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/**
 * Breadcrumb Component
 * @param {Array} items - Array of breadcrumb items: [{ label: string, href?: string }]
 * @param {boolean} showHome - Whether to show home link (default: true)
 * @param {string} homeLabel - Label for home link (default: "خانه")
 */
export default function Breadcrumb({ 
  items = [], 
  showHome = true,
  homeLabel = "خانه"
}) {
  const allItems = showHome 
    ? [{ label: homeLabel, href: "/" }, ...items]
    : items;

  if (allItems.length === 0) return null;

  return (
    <div className="w-full bg-white border-b border-gray-200 py-2 sm:py-3">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const isLink = item.href && !isLast;

            return (
              <div key={index} className="flex items-center gap-1.5 sm:gap-2">
                {isLink ? (
                  <Link 
                    href={item.href}
                    prefetch={true}
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
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

