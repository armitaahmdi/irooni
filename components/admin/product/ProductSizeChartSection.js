"use client";

import { X } from "lucide-react";

/**
 * ProductSizeChartSection Component
 * Product size chart management
 */
export default function ProductSizeChartSection({
  formData,
  setFormData,
  newSizeChart,
  setNewSizeChart,
  onAddSizeChart,
  onRemoveSizeChart,
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">جدول سایز</h2>

      <div className="grid grid-cols-3 gap-2 mb-2">
        <input
          type="text"
          value={newSizeChart.size}
          onChange={(e) => setNewSizeChart({ ...newSizeChart, size: e.target.value })}
          placeholder="سایز"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
        />
        <input
          type="text"
          value={newSizeChart.chest}
          onChange={(e) => setNewSizeChart({ ...newSizeChart, chest: e.target.value })}
          placeholder="عرض سینه (cm)"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={newSizeChart.length}
            onChange={(e) => setNewSizeChart({ ...newSizeChart, length: e.target.value })}
            placeholder="قد لباس (cm)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
          />
          <button
            type="button"
            onClick={onAddSizeChart}
            className="px-4 py-2 bg-[#286378] text-white rounded-lg hover:bg-[#43909A] transition-colors"
          >
            افزودن
          </button>
        </div>
      </div>
      {(formData.sizeChart || []).length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 border border-gray-300">
                  سایز
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 border border-gray-300">
                  عرض سینه (cm)
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 border border-gray-300">
                  قد لباس (cm)
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 border border-gray-300">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {(formData.sizeChart || []).map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">
                    {item.size}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">
                    {item.chest}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">
                    {item.length}
                  </td>
                  <td className="px-4 py-2 text-sm border border-gray-300">
                    <button
                      type="button"
                      onClick={() => onRemoveSizeChart(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

