"use client";

import Link from "next/link";
import { MapPin, Loader2, CheckCircle } from "lucide-react";

/**
 * AddressSelection Component
 * Address selection for checkout
 */
export default function AddressSelection({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  isLoadingAddresses,
}) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#286378]" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">انتخاب آدرس ارسال</h2>
      </div>

      {isLoadingAddresses ? (
        <div className="flex items-center justify-center py-6 sm:py-8">
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-[#286378]" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
            شما هنوز آدرسی ثبت نکرده‌اید
          </p>
          <Link
            href="/profile?section=addresses"
            className="inline-flex items-center gap-2 text-[#286378] hover:text-[#43909A] font-semibold text-sm sm:text-base"
          >
            افزودن آدرس جدید
          </Link>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {addresses.map((address) => (
            <label
              key={address.id}
              className={`block p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                selectedAddressId === address.id
                  ? "border-[#286378] bg-[#286378]/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="address"
                value={address.id}
                checked={selectedAddressId === address.id}
                onChange={(e) => setSelectedAddressId(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-start gap-2 sm:gap-3">
                <div
                  className={`mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedAddressId === address.id
                      ? "border-[#286378] bg-[#286378]"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAddressId === address.id && (
                    <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                      {address.title}
                    </h3>
                    {address.isDefault && (
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium bg-[#286378] text-white rounded-full">
                        پیش‌فرض
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {address.province}، {address.city}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">{address.address}</p>
                  {address.postalCode && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      کدپستی: {address.postalCode}
                    </p>
                  )}
                </div>
              </div>
            </label>
          ))}
          <Link
            href="/profile?section=addresses"
            className="block text-center text-sm sm:text-base text-[#286378] hover:text-[#43909A] font-semibold py-2.5 sm:py-3 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl hover:border-[#286378] transition-colors"
          >
            + افزودن آدرس جدید
          </Link>
        </div>
      )}
    </div>
  );
}

