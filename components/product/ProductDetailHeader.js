"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * ProductDetailHeader Component
 * Mobile header for product detail page with back button and favorite
 */
export default function ProductDetailHeader({ isLiked, onToggleFavorite, breadcrumbItems = [], fallbackUrl = "/" }) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  // بررسی اینکه آیا history وجود دارد
  useEffect(() => {
    // بررسی اینکه آیا می‌توانیم به صفحه قبلی برگردیم
    if (typeof window !== "undefined") {
      setCanGoBack(window.history.length > 1);
    }
  }, []);

  const handleBack = () => {
    // اگر breadcrumb items داریم و آخرین آیتم href دارد، به آن برو
    if (breadcrumbItems && breadcrumbItems.length > 1) {
      const previousItem = breadcrumbItems[breadcrumbItems.length - 2];
      if (previousItem?.href) {
        router.push(previousItem.href);
        return;
      }
    }

    // اگر می‌توانیم به صفحه قبلی برگردیم، از router.back استفاده کن
    if (canGoBack) {
      router.back();
    } else {
      // در غیر این صورت، به fallback URL برو
      router.push(fallbackUrl);
    }
  };

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
      <div className="h-14 px-4 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm border border-gray-100"
          aria-label="بازگشت"
        >
          <ArrowRight className="w-5 h-5 text-gray-800" />
        </button>
        
        <h1 className="text-base font-bold text-gray-900">جزئیات محصول</h1>
        
        <button
          onClick={onToggleFavorite}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-sm border overflow-hidden ${
            isLiked
              ? "bg-gradient-to-br from-red-500 to-red-600 text-white border-red-400 shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-100"
          }`}
          aria-label="علاقه‌مندی"
        >
          {/* Pulse effect when liked */}
          {isLiked && (
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
          )}
          <Heart
            className={`relative z-10 w-5 h-5 transition-all duration-300 ${
              isLiked ? "fill-current scale-110" : "hover:scale-110"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

