"use client";

import { MapPin } from "lucide-react";
import { formatDate } from "@/utils/reviewHelpers";

/**
 * UserAddressesTab Component
 * User addresses tab content
 */
export default function UserAddressesTab({ addresses }) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">این کاربر هنوز آدرسی ثبت نکرده است</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#286378] transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#286378]" />
              <h4 className="text-lg font-bold text-gray-900">{address.title}</h4>
              {address.isDefault && (
                <span className="px-2 py-1 text-xs font-medium bg-[#286378] text-white rounded-full">
                  پیش‌فرض
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-700">استان:</span> {address.province}
            </p>
            <p>
              <span className="font-medium text-gray-700">شهر:</span> {address.city}
            </p>
            <p>
              <span className="font-medium text-gray-700">آدرس:</span> {address.address}
            </p>
            {address.plaque && (
              <p>
                <span className="font-medium text-gray-700">پلاک:</span> {address.plaque}
              </p>
            )}
            {address.unit && (
              <p>
                <span className="font-medium text-gray-700">واحد:</span> {address.unit}
              </p>
            )}
            {address.postalCode && (
              <p>
                <span className="font-medium text-gray-700">کدپستی:</span> {address.postalCode}
              </p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
            ثبت شده در: {formatDate(address.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
}

