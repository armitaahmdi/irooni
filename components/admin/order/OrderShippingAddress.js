"use client";

import { MapPin } from "lucide-react";

/**
 * OrderShippingAddress Component
 * Shipping address section
 */
export default function OrderShippingAddress({ address }) {
  if (!address) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-5 h-5 text-[#286378]" />
        <h3 className="text-lg font-bold text-gray-900">آدرس ارسال</h3>
      </div>
      <div className="text-sm text-gray-700">
        <p className="font-semibold mb-2">{address.title}</p>
        <p>
          {address.province}، {address.city}
        </p>
        <p>{address.address}</p>
        {address.postalCode && <p className="mt-2">کدپستی: {address.postalCode}</p>}
      </div>
    </div>
  );
}

