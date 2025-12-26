"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * CheckoutHeader Component
 * Header for checkout page
 */
export default function CheckoutHeader() {
  return (
    <div className="mb-4 sm:mb-6 md:mb-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#286378] mb-2 sm:mb-4 text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        بازگشت به سبد خرید
      </Link>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">تکمیل سفارش</h1>
    </div>
  );
}

