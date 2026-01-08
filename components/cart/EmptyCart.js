"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft, Sparkles } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 sm:py-12 md:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8 sm:py-12 md:py-16">
          {/* Icon with animation */}
          <div className="relative inline-flex items-center justify-center mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse opacity-50"></div>
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full p-6 sm:p-8 border-4 border-blue-100">
              <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-blue-400" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            سبد خرید شما خالی است
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-2 px-4">
            هنوز محصولی به سبد خرید اضافه نکرده‌اید
          </p>
          <p className="text-sm sm:text-base text-gray-500 mb-8 sm:mb-10 px-4">
            محصولات مورد علاقه خود را پیدا کرده و به سبد خرید اضافه کنید
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] bg-gradient-to-r from-[#286378] to-[#43909A] text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:from-[#43909A] hover:to-[#286378] transition-all duration-300 text-base sm:text-lg shadow-md hover:shadow-lg active:scale-[0.98] w-full sm:w-auto"
              aria-label="بازگشت به فروشگاه و مشاهده محصولات"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              <span>بازگشت به فروشگاه</span>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] bg-white border-2 border-gray-300 text-gray-700 font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 text-base sm:text-lg shadow-sm hover:shadow-md active:scale-[0.98] w-full sm:w-auto"
              aria-label="مشاهده تمام محصولات"
            >
              <span>مشاهده محصولات</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

