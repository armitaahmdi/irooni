"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectRecentlyViewedProducts } from "@/store/slices/recentlyViewedSlice";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";

export default function RecentlyViewedSection({ excludeProductId = null, maxItems = 8 }) {
  const recentlyViewedItems = useAppSelector(selectRecentlyViewedProducts);
  
  const displayedProducts = useMemo(() => {
    // Filter out excluded product and limit items
    let products = recentlyViewedItems;
    
    if (excludeProductId) {
      products = products.filter((p) => p.id !== excludeProductId);
    }
    
    // Limit to maxItems
    return products.slice(0, maxItems);
  }, [recentlyViewedItems, excludeProductId, maxItems]);

  // Don't render if no products
  if (displayedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#286378] to-[#43909A] rounded-xl flex items-center justify-center shadow-md">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                محصولات اخیرا مشاهده شده
              </h2>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                محصولاتی که اخیرا مشاهده کرده‌اید
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Link (if more than displayed) */}
        {recentlyViewedItems.length > maxItems && (
          <div className="mt-8 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#286378] to-[#43909A] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>مشاهده همه محصولات</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

