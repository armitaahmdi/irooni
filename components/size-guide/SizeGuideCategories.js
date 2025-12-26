"use client";

import { sizeGuides } from "@/data/sizeGuideData";

/**
 * SizeGuideCategories Component
 * Category selection buttons
 */
export default function SizeGuideCategories({ activeCategory, onCategoryChange }) {
  return (
    <section className="py-8 md:py-12 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
          {Object.entries(sizeGuides).map(([key, guide]) => (
            <button
              key={key}
              onClick={() => onCategoryChange(key)}
              className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeCategory === key
                  ? "bg-gradient-to-r from-[#286378] to-[#43909A] text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {guide.icon}
              <span className="text-sm md:text-base">{guide.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

