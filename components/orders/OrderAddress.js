"use client";

import { MapPin } from "lucide-react";

/**
 * OrderAddress Component
 * Displays shipping address
 */
export default function OrderAddress({ address }) {
  if (!address) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#286378] to-[#43909A] flex items-center justify-center">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">آدرس ارسال</h2>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-gray-700">
        <p className="font-semibold text-gray-900 text-lg mb-3">{address.title}</p>
        <div className="flex items-start gap-2">
          <span className="text-gray-500 min-w-[80px]">استان:</span>
          <span className="font-medium">{address.province}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-gray-500 min-w-[80px]">شهر:</span>
          <span className="font-medium">{address.city}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-gray-500 min-w-[80px]">آدرس:</span>
          <span className="font-medium">{address.address}</span>
        </div>
        {address.plaque && (
          <div className="flex items-start gap-2">
            <span className="text-gray-500 min-w-[80px]">پلاک:</span>
            <span className="font-medium">{address.plaque}</span>
          </div>
        )}
        {address.unit && (
          <div className="flex items-start gap-2">
            <span className="text-gray-500 min-w-[80px]">واحد:</span>
            <span className="font-medium">{address.unit}</span>
          </div>
        )}
        {address.postalCode && (
          <div className="flex items-start gap-2">
            <span className="text-gray-500 min-w-[80px]">کدپستی:</span>
            <span className="font-medium font-mono">{address.postalCode}</span>
          </div>
        )}
      </div>
    </div>
  );
}

