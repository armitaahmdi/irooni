"use client";

import Link from "next/link";
import { formatPrice } from "@/utils/orderHelpers";

export default function CartSummary({ total }) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 sticky top-4 sm:top-6 md:top-8">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">خلاصه سفارش</h2>

      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <div className="flex justify-between text-sm sm:text-base text-gray-600">
          <span>جمع کل:</span>
          <span className="font-semibold">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm sm:text-base text-gray-600">
          <span>هزینه ارسال:</span>
          <span className="font-semibold text-xs sm:text-sm">محاسبه در مرحله بعد</span>
        </div>
        <div className="border-t border-gray-200 pt-3 sm:pt-4 flex justify-between text-base sm:text-lg font-bold text-gray-900">
          <span>مبلغ قابل پرداخت:</span>
          <span className="text-[#286378]">{formatPrice(total)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#286378] to-[#43909A] text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-[#43909A] hover:to-[#286378] transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
      >
        ادامه و تکمیل سفارش
      </Link>
    </div>
  );
}

