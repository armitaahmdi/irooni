"use client";

import { Tag, CheckCircle, X, Loader2 } from "lucide-react";

const formatPrice = (value) =>
  new Intl.NumberFormat("fa-IR").format(value) + " تومان";

/**
 * CouponCode Component
 * Coupon code input and validation
 */
export default function CouponCode({
  couponCode,
  setCouponCode,
  appliedCoupon,
  isValidatingCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-[#286378]" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">کد تخفیف</h2>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm sm:text-base font-semibold text-green-800">
                کد {appliedCoupon.couponCode} اعمال شد
              </p>
              <p className="text-xs sm:text-sm text-green-600">
                {formatPrice(appliedCoupon.discountAmount)} تخفیف
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemoveCoupon}
            className="p-1.5 sm:p-2 hover:bg-green-100 rounded-full transition-colors"
            aria-label="حذف کد تخفیف"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="کد تخفیف خود را وارد کنید"
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onApplyCoupon();
              }
            }}
          />
          <button
            type="button"
            onClick={onApplyCoupon}
            disabled={isValidatingCoupon || !couponCode.trim()}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#286378] to-[#43909A] text-white font-semibold rounded-lg hover:from-[#43909A] hover:to-[#286378] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center gap-2"
          >
            {isValidatingCoupon ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">در حال بررسی...</span>
              </>
            ) : (
              "اعمال"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

