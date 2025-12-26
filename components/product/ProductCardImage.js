"use client";

import Image from "next/image";
import Link from "next/link";
import { isNewProduct } from "@/utils/productCardHelpers";
import { getProductUrl } from "@/utils/productCardHelpers";

/**
 * ProductCardImage Component
 * Product image with badges (discount, new, out of stock)
 */
export default function ProductCardImage({
  product,
  hasDiscount,
  discountPercent,
  isOutOfStock,
}) {
  const isNew = isNewProduct(product);
  const productUrl = getProductUrl(product);

  return (
    <Link href={productUrl} prefetch={true} className="block">
      <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 via-gray-50/80 to-gray-100/60 group-hover/card:from-gray-100 group-hover/card:via-gray-100/90 group-hover/card:to-gray-200/70 transition-all duration-700 rounded-t-3xl">
        {/* Soft shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover/card:from-white/20 group-hover/card:via-white/10 group-hover/card:to-white/0 transition-all duration-700 z-10 pointer-events-none"></div>
        {product.image && (
          <>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover/card:scale-[1.08] group-hover/card:brightness-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
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
    </Link>
  );
}

