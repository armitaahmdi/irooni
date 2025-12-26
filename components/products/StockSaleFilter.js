"use client";

import { ChevronDown, ChevronUp, Package } from "lucide-react";

/**
 * StockSaleFilter Component
 * Stock and sale filters (checkboxes)
 */
export default function StockSaleFilter({
  inStock,
  setInStock,
  onSale,
  setOnSale,
  expandedFilters,
  toggleFilterSection,
}) {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200/60">
      <button
        onClick={() => toggleFilterSection("stock")}
        className="w-full flex items-center justify-between text-sm font-bold text-gray-800 mb-4 hover:text-[#286378] transition-all duration-200 group py-1"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-[#286378]/10 transition-all duration-200">
            <Package className="w-4 h-4 text-gray-500 group-hover:text-[#286378] transition-colors" />
          </div>
          <span>موجودی و حراج</span>
        </div>
        {expandedFilters.stock ? (
          <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-[#286378] transition-all duration-200" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#286378] transition-all duration-200" />
        )}
      </button>
      {expandedFilters.stock && (
        <div className="space-y-3.5 pl-11">
          <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4.5 h-4.5 text-[#286378] border-gray-300 rounded-md focus:ring-2 focus:ring-[#286378] focus:ring-offset-2 cursor-pointer transition-all shadow-sm"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-[#286378] transition-colors">
              موجود در انبار
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
            <input
              type="checkbox"
              checked={onSale}
              onChange={(e) => setOnSale(e.target.checked)}
              className="w-4.5 h-4.5 text-[#286378] border-gray-300 rounded-md focus:ring-2 focus:ring-[#286378] focus:ring-offset-2 cursor-pointer transition-all shadow-sm"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-[#286378] transition-colors">
              محصولات تخفیف‌دار
            </span>
          </label>
        </div>
      )}
    </div>
  );
}

