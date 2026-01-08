"use client";

import { formatPrice, getProductUrl } from "@/utils/productCardHelpers";
import NavigationLink from "@/components/NavigationLink";

/**
 * ProductCardInfo Component
 * Product information (name, code, material, price)
 */
export default function ProductCardInfo({ product, hasDiscount }) {
  const productUrl = getProductUrl(product);
  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const sortedSizes = [...sizes].sort((a, b) => {
    const indexA = sizeOrder.indexOf(a);
    const indexB = sizeOrder.indexOf(b);
    const safeIndexA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
    const safeIndexB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
    if (safeIndexA !== safeIndexB) return safeIndexA - safeIndexB;
    return a.localeCompare(b, "fa");
  });
  const visibleSizes = sortedSizes.slice(0, 4);
  const ratingValue =
    typeof product.rating === "number"
      ? product.rating
      : typeof product.rating === "string"
        ? parseFloat(product.rating)
        : 4.8;
  const safeRating = Number.isFinite(ratingValue) ? ratingValue : 4.8;

  return (
    <NavigationLink href={productUrl} prefetch={true} className="block">
      <div className="px-3 sm:px-4 md:px-5 pt-3">
        {/* Title */}
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#286378] transition-all duration-300 min-h-[2.75rem] sm:min-h-[3.25rem] leading-5 sm:leading-6">
          {product.name}
        </h3>

        {/* Product Code & Material - Compact */}
        {(product.code || product.material) && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
            {product.code && <span>کد: {product.code}</span>}
            {product.code && product.material && <span className="text-gray-300">•</span>}
            {product.material && <span>جنس: {product.material}</span>}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-600">
          <div className="flex items-center gap-0.5 text-amber-400" aria-label={`امتیاز ${safeRating}`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={star <= Math.round(safeRating) ? "" : "text-gray-200"}>
                ★
              </span>
            ))}
          </div>
          <span className="font-medium">{safeRating.toFixed(1)}</span>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#286378] group-hover:scale-105 transition-transform duration-300 inline-block">
            {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs font-semibold text-white bg-rose-500 px-2 py-0.5 rounded-full">
                فروش ویژه
              </span>
            )}
          </div>
          {hasDiscount && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {visibleSizes.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] text-gray-600">
            {visibleSizes.map((size) => (
              <span
                key={size}
                className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700"
              >
                {size}
              </span>
            ))}
            {sortedSizes.length > visibleSizes.length && (
              <span className="text-[10px] text-gray-400">
                +{sortedSizes.length - visibleSizes.length}
              </span>
            )}
          </div>
        )}
      </div>
    </NavigationLink>
  );
}
