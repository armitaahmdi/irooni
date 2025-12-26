"use client";

import Image from "next/image";
import { isNewProduct } from "@/utils/productCardHelpers";
import { getProductUrl } from "@/utils/productCardHelpers";
import NavigationLink from "@/components/NavigationLink";

/**
 * ProductCardImage Component
 * Product image with badges (discount, new, out of stock)
 */
export default function ProductCardImage({
  product,
  hasDiscount,
  discountPercent,
  isOutOfStock,
  onQuickView,
}) {
  const isNew = isNewProduct(product);
  const productUrl = getProductUrl(product);
  const imageCandidates = [product.image, ...(product.images || [])].filter(Boolean);
  const primaryImage = imageCandidates[0] || null;
  const secondaryImage = imageCandidates.find((image) => image !== primaryImage) || null;

  return (
    <div className="relative">
      <NavigationLink href={productUrl} prefetch={true} className="block">
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 via-gray-50/80 to-gray-100/60 group-hover/card:from-gray-100 group-hover/card:via-gray-100/90 group-hover/card:to-gray-200/70 transition-all duration-700 rounded-t-3xl">
          {/* Soft shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover/card:from-white/20 group-hover/card:via-white/10 group-hover/card:to-white/0 transition-all duration-700 z-10 pointer-events-none"></div>
          {primaryImage && (
            <>
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className={`object-cover transition-all duration-700 group-hover/card:scale-[1.08] group-hover/card:brightness-105 ${
                  secondaryImage ? "opacity-100 group-hover/card:opacity-0" : ""
                }`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage}
                  alt={`${product.name} - نمای دوم`}
                  fill
                  className="object-cover transition-all duration-700 opacity-0 scale-105 group-hover/card:opacity-100 group-hover/card:scale-[1.08]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
              {/* Premium Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent group-hover/card:from-black/8 group-hover/card:via-black/3 group-hover/card:to-transparent transition-all duration-700"></div>
              
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#286378]/0 to-transparent group-hover/card:from-[#286378]/5 transition-all duration-700 rounded-bl-full"></div>
            </>
          )}

          {/* Discount Badge - Premium Design */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
              <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-2xl border border-red-400/30 backdrop-blur-sm group-hover/card:scale-110 transition-transform duration-300"
                style={{
                  boxShadow: `
                    0 4px 12px rgba(239, 68, 68, 0.4),
                    0 2px 6px rgba(239, 68, 68, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                }}
              >
                <span className="relative z-10">{discountPercent}% تخفیف</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          )}

          {/* Badge: اتمام موجودی یا جدید - Premium Design */}
          {isOutOfStock ? (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
              <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-2xl border border-orange-400/30 backdrop-blur-sm group-hover/card:scale-110 transition-transform duration-300"
                style={{
                  boxShadow: `
                    0 4px 12px rgba(249, 115, 22, 0.4),
                    0 2px 6px rgba(249, 115, 22, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                }}
              >
                <span className="relative z-10">اتمام موجودی</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          ) : isNew ? (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
              <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-2xl border border-emerald-400/30 backdrop-blur-sm group-hover/card:scale-110 transition-transform duration-300"
                style={{
                  boxShadow: `
                    0 4px 12px rgba(16, 185, 129, 0.4),
                    0 2px 6px rgba(16, 185, 129, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                }}
              >
                <span className="relative z-10">جدید</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          ) : null}
        </div>
      </NavigationLink>
      {onQuickView && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onQuickView();
          }}
          className="absolute left-1/2 -translate-x-1/2 bottom-4 z-30 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#286378]/90 hover:bg-[#286378] rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-300 shadow-lg"
          aria-label="پیش‌نمایش سریع"
        >
          پیش‌نمایش سریع
        </button>
      )}
    </div>
  );
}
