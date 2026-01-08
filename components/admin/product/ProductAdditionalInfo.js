"use client";

import { X } from "lucide-react";

/**
 * ProductAdditionalInfo Component
 * Additional product information (material, description, features)
 */
export default function ProductAdditionalInfo({
  formData,
  setFormData,
  newFeature,
  setNewFeature,
  onAddFeature,
  onRemoveFeature,
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">اطلاعات تکمیلی</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">جنس محصول</label>
        <input
          type="text"
          value={formData.material}
          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
          placeholder="مثال: پنبه 100%"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ویژگی‌ها</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="مثال: پارچه 100% پنبه"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
          />
          <button
            type="button"
            onClick={onAddFeature}
            className="px-4 py-2 bg-[#286378] text-white rounded-lg hover:bg-[#43909A] transition-colors"
          >
            افزودن
          </button>
        </div>
        <div className="space-y-2">
          {(formData.features || []).map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <span className="text-sm text-gray-700">{feature}</span>
              <button
                type="button"
                onClick={() => onRemoveFeature(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

