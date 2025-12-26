"use client";

import { MapPin, Plus, Edit, Trash2 } from "lucide-react";

/**
 * AddressesSection Component
 * Addresses list and management
 */
export default function AddressesSection({
  addresses,
  isLoading,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#286378]">آدرس‌ها</h2>
        <button
          onClick={onAddAddress}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#286378] to-[#43909A] text-white rounded-xl hover:shadow-lg transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن آدرس جدید</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378] mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری آدرس‌ها...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">هنوز آدرسی ثبت نشده است</p>
          <button
            onClick={onAddAddress}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-[#286378] to-[#43909A] text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            افزودن آدرس جدید
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#286378] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{address.title}</h3>
                    {address.isDefault && (
                      <span className="px-2 py-1 text-xs font-medium bg-[#286378] text-white rounded-full">
                        پیش‌فرض
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">استان:</span> {address.province}
                    </p>
                    <p>
                      <span className="font-medium">شهر:</span> {address.city}
                    </p>
                    <p>
                      <span className="font-medium">آدرس:</span> {address.address}
                    </p>
                    {address.plaque && (
                      <p>
                        <span className="font-medium">پلاک:</span> {address.plaque}
                      </p>
                    )}
                    {address.unit && (
                      <p>
                        <span className="font-medium">واحد:</span> {address.unit}
                      </p>
                    )}
                    {address.postalCode && (
                      <p>
                        <span className="font-medium">کدپستی:</span> {address.postalCode}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditAddress(address)}
                    className="p-2 text-[#286378] hover:bg-[#286378]/10 rounded-lg transition-colors"
                    title="ویرایش"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDeleteAddress(address.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

