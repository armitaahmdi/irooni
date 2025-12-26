"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center py-8 sm:py-12 md:py-16">
          <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-300 mx-auto mb-4 sm:mb-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">سبد خرید شما خالی است</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-4">
            محصولات مورد علاقه خود را به سبد خرید اضافه کنید
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#286378] to-[#43909A] text-white font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-[#43909A] hover:to-[#286378] transition-all text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}

