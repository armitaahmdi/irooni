"use client";

import Link from "next/link";

/**
 * MegaMenu Component
 * Dropdown menu for category subcategories
 */
export default function MegaMenu({ category, onMouseEnter, onMouseLeave }) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute right-0 top-full mt-3 bg-white/98 backdrop-blur-md border border-gray-200/80 shadow-2xl rounded-2xl py-6 px-8 min-w-[240px] z-50"
      style={{
        boxShadow: "0 20px 60px rgba(40, 99, 120, 0.2), 0 0 0 1px rgba(40, 99, 120, 0.05)",
        animation: "fadeInSlide 0.3s ease-out forwards",
      }}
    >
      <div className="flex flex-col gap-4">
        {category.subcategories.map((subcat, idx) => (
          <Link
            key={idx}
            href={`/${category.slug}/${subcat.slug}`}
            className="group relative text-sm font-semibold text-gray-800 hover:text-[#286378] transition-all duration-300 py-2.5 px-4 rounded-xl hover:bg-gradient-to-r hover:from-[#A2CFFF]/25 hover:to-[#A2CFFF]/15 hover:pr-8 hover:shadow-sm hover:scale-[1.02]"
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            <span className="relative z-10 flex items-center gap-2">{subcat.name}</span>
            <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-[#286378] to-[#43909A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right rounded-full"></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

