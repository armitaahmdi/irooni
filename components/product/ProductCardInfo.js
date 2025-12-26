"use client";

import Link from "next/link";
import { formatPrice, getProductUrl } from "@/utils/productCardHelpers";

/**
 * ProductCardInfo Component
 * Product information (name, code, material, price)
 */
export default function ProductCardInfo({ product, hasDiscount }) {
  const productUrl = getProductUrl(product);

  return (
    <Link href={productUrl} className="block">
      <div className="px-3 sm:px-4 md:px-5 pt-3 sm:pt-4">
        {/* Title */}
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#286378] transition-all duration-300 min-h-[3rem] sm:min-h-[3.5rem] leading-5 sm:leading-6">
          {product.name}
        </h3>

        {/* Product Code & Material - Premium Design */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {product.code && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-gray-50 via-gray-50/90 to-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-sm group-hover/card:shadow-md group-hover/card:border-gray-300/60 transition-all duration-300"
              style={{
                boxShadow: `
                  0 2px 8px rgba(0, 0, 0, 0.04),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `,
              }}
            >
              <span className="text-xs text-gray-500 font-medium">کد:</span>
              <span className="text-xs font-bold text-gray-900">
                {product.code}
              </span>
            </div>
          )}
          {product.material && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-blue-50 via-blue-50/90 to-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-xl shadow-sm group-hover/card:shadow-md group-hover/card:border-blue-300/60 transition-all duration-300"
              style={{
                boxShadow: `
                  0 2px 8px rgba(59, 130, 246, 0.08),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `,
              }}
            >
              <span className="text-xs text-blue-600 font-medium">جنس:</span>
              <span className="text-xs font-bold text-gray-900">
                {product.material}
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1">
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#286378] group-hover:scale-105 transition-transform duration-300 inline-block">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

