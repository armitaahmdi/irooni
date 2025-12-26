"use client";

import { colorMap } from "@/utils/colorMap";

/**
 * ProductVariantsSection Component
 * Product sizes and colors variants management
 */
export default function ProductVariantsSection({
  formData,
  setFormData,
  availableSizes,
  allColors,
  onToggleSize,
  onToggleColor,
  onUpdateVariantStock,
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">سایز و رنگ</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">سایزها و موجودی</label>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onToggleSize(size)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  (formData.sizes || []).includes(size)
                    ? "bg-[#286378] text-white border-[#286378]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#286378]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* موجودی هر سایز و رنگ */}
          {(formData.sizes || []).length > 0 && (formData.colors || []).length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                موجودی هر سایز و رنگ
              </label>
              <div className="space-y-4">
                {(formData.sizes || []).map((size) => (
                  <div key={size} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">سایز {size}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {(formData.colors || []).map((color) => {
                        const colorHex = colorMap[color] || "#000000";
                        const needsBorder = color === "سفید" || color === "کرم" || color === "بژ";
                        const variant = formData.variants?.find(
                          (v) => v.size === size && v.color === color
                        );
                        return (
                          <div key={`${size}-${color}`} className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`w-4 h-4 rounded-full ${needsBorder ? "border border-gray-300" : ""}`}
                                style={{ backgroundColor: colorHex }}
                                title={color}
                              />
                              <label className="block text-xs text-gray-600">{color}</label>
                            </div>
                            <input
                              type="number"
                              min="0"
                              value={variant?.stock || 0}
                              onChange={(e) => onUpdateVariantStock(size, color, e.target.value)}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent text-sm"
                              placeholder="0"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">رنگ‌ها</label>
        <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {allColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onToggleColor(color)}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                  (formData.colors || []).includes(color)
                    ? "bg-[#286378]/10 border-[#286378]"
                    : "bg-white border-gray-300 hover:border-[#286378]"
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{
                    backgroundColor: colorMap[color] || "#ccc",
                  }}
                />
                <span className="text-sm text-gray-700">{color}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

