"use client";

import { Check } from "lucide-react";
import ProductReviews from "@/components/ProductReviews";

/**
 * ProductDetailsTabs Component
 * Tabs for description, features, and reviews
 */
export default function ProductDetailsTabs({ product, activeTab, onTabChange, reviewsCount }) {
  if (!product) return null;

  return (
    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-sm border border-gray-200 mb-8 sm:mb-10 md:mb-12">
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-6 overflow-x-auto">
          <button
            onClick={() => onTabChange("description")}
            className={`py-3 sm:py-4 px-2 font-semibold text-xs sm:text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "description"
                ? "border-[#286378] text-[#286378]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            توضیحات محصول
          </button>
          {product.features && product.features.length > 0 && (
            <button
              onClick={() => onTabChange("features")}
              className={`py-3 sm:py-4 px-2 font-semibold text-xs sm:text-sm transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "features"
                  ? "border-[#286378] text-[#286378]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              ویژگی‌ها
            </button>
          )}
          <button
            onClick={() => onTabChange("reviews")}
            className={`py-3 sm:py-4 px-2 font-semibold text-xs sm:text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "reviews"
                ? "border-[#286378] text-[#286378]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            نظرات ({reviewsCount})
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 lg:p-8">
        {activeTab === "description" && product.description && (
          <div className="prose prose-sm max-w-none">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        )}

        {activeTab === "features" && product.features && product.features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2 sm:gap-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && product && (
          <ProductReviews productId={product.id} />
        )}
      </div>
    </div>
  );
}

