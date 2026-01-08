"use client";

import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

const formatPrice = (value) =>
  new Intl.NumberFormat("fa-IR").format(value) + " تومان";

/**
 * OrderSummary Component
 * Order summary sidebar with totals and submit button
 */
export default function OrderSummary({
  total,
  discountAmount,
  shippingCost,
  finalTotal,
  appliedCoupon,
  addresses,
  selectedAddressId,
  orderLoading,
  onSubmit,
}) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 sticky top-4 sm:top-6 md:top-8">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6">
        خلاصه سفارش
      </h2>

      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5 md:mb-6">
        <div className="flex justify-between text-sm sm:text-base text-gray-600">
          <span>جمع کل:</span>
          <span className="font-semibold">{formatPrice(total)}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between text-sm sm:text-base text-green-600">
            <span>تخفیف ({appliedCoupon.couponCode}):</span>
            <span className="font-semibold">-{formatPrice(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm sm:text-base text-gray-600">
          <span>هزینه ارسال:</span>
          <span className="font-semibold text-xs sm:text-sm">
            {shippingCost === 0 ? "رایگان" : formatPrice(shippingCost)}
          </span>
        </div>
        <div className="border-t border-gray-200 pt-3 sm:pt-4 flex justify-between text-base sm:text-lg font-bold text-gray-900">
          <span>مبلغ قابل پرداخت:</span>
          <span className="text-[#286378]">{formatPrice(finalTotal)}</span>
        </div>
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        disabled={!selectedAddressId || orderLoading || addresses.length === 0}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#286378] to-[#43909A] text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-[#43909A] hover:to-[#286378] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {orderLoading ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            <span>در حال ثبت سفارش...</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>ثبت و پرداخت سفارش</span>
          </>
        )}
      </button>

      {addresses.length === 0 && (
        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-orange-600 text-xs sm:text-sm bg-orange-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>لطفاً آدرس ارسال را انتخاب کنید</span>
        </div>
      )}
    </div>
  );
}

