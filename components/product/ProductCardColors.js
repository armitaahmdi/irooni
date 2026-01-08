"use client";

import { getColorHex } from "@/utils/colorMap";

/**
 * ProductCardColors Component
 * Display product colors
 */
export default function ProductCardColors({ colors }) {
  if (!colors || colors.length === 0) return null;

  const needsBorder = (color) => {
    return (
      color === "سفید" ||
      color === "کرم" ||
      color === "بژ" ||
      color === "کرمی" ||
      color === "کرم روشن" ||
      color === "کرم تیره" ||
      color === "طوسی روشن" ||
      color === "زرد کره ای"
    );
  };

  return (
    <div className="flex items-center gap-2">
      {colors.slice(0, 5).map((color, index) => {
        const colorHex = getColorHex(color);
        const borderClass = needsBorder(color)
          ? "border-2 border-gray-300"
          : "border border-gray-200";

        return (
          <div
            key={index}
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${borderClass} shadow-sm hover:scale-125 hover:shadow-md transition-all duration-300 cursor-pointer group-hover/card:scale-110`}
            style={{ backgroundColor: colorHex }}
            title={color}
          />
        );
      })}
      {colors.length > 5 && (
        <span className="text-xs sm:text-sm text-gray-500 font-medium group-hover/card:text-[#286378] transition-colors duration-300">+{colors.length - 5}</span>
      )}
    </div>
  );
}

