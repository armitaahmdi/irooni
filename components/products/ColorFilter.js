"use client";

import { ChevronDown, ChevronUp, Palette, Check } from "lucide-react";
import { getColorHex } from "@/utils/colorMap";

/**
 * ColorFilter Component
 * Color selection filter
 */
export default function ColorFilter({
  availableColors,
  selectedColor,
  setSelectedColor,
  expandedFilters,
  toggleFilterSection,
}) {
  if (availableColors.length === 0) return null;

  const needsBorder = (color) => {
    return (
      color === "سفید" ||
      color === "کرم" ||
      color === "بژ" ||
      color === "کرمی" ||
      color === "کرم روشن" ||
      color === "کرم تیره" ||
      color === "زرد کره ای"
    );
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200/60">
      <button
        onClick={() => toggleFilterSection("color")}
        className="w-full flex items-center justify-between text-sm font-bold text-gray-800 mb-4 hover:text-[#286378] transition-all duration-200 group py-1"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-[#286378]/10 transition-all duration-200">
            <Palette className="w-4 h-4 text-gray-500 group-hover:text-[#286378] transition-colors" />
          </div>
          <span>رنگ</span>
        </div>
        {expandedFilters.color ? (
          <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-[#286378] transition-all duration-200" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#286378] transition-all duration-200" />
        )}
      </button>
      {expandedFilters.color && (
        <ul className="space-y-2.5 pl-11">
          {availableColors.map(({ color, count }) => {
            const colorHex = getColorHex(color);
            const isSelected = selectedColor === color;
            const hasProducts = count > 0;

            return (
              <li key={color}>
                <button
                  onClick={() => setSelectedColor(isSelected ? "" : color)}
                  disabled={!hasProducts}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                    hasProducts
                      ? isSelected
                        ? "bg-gradient-to-r from-[#286378]/10 to-[#286378]/5 border-2 border-[#286378] shadow-sm"
                        : "hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 cursor-pointer hover:shadow-sm"
                      : "opacity-50 cursor-not-allowed border-2 border-transparent"
                  }`}
                >
                  <span
                    className={`relative w-10 h-10 rounded-full flex-shrink-0 transition-all shadow-md ${
                      isSelected
                        ? "ring-2 ring-[#286378] ring-offset-2 scale-110 shadow-lg"
                        : "group-hover:scale-105 group-hover:shadow-lg"
                    }`}
                    style={{
                      backgroundColor: colorHex,
                      border: needsBorder(color) ? "2px solid #E5E7EB" : "none",
                    }}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </span>
                  <span
                    className={`flex-1 text-sm text-right font-semibold ${
                      hasProducts
                        ? isSelected
                          ? "text-[#286378]"
                          : "text-gray-700 group-hover:text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {color}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      hasProducts
                        ? isSelected
                          ? "bg-[#286378]/15 text-[#286378]"
                          : "bg-gray-100 text-gray-600"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

