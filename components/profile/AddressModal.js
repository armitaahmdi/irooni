"use client";

import { X, Save } from "lucide-react";
import { provinces, getCitiesByProvince } from "@/data/provinces";

/**
 * AddressModal Component
 * Modal for adding/editing addresses
 */
export default function AddressModal({
  isOpen,
  mode,
  addressForm,
  setAddressForm,
  availableCities,
  setAvailableCities,
  isLoading,
  onSave,
  onCancel,
}) {
  if (!isOpen) return null;

  const handleProvinceChange = (provinceName) => {
    setAddressForm((prev) => ({
      ...prev,
      province: provinceName,
      city: "",
    }));
    if (provinceName) {
      setAvailableCities(getCitiesByProvince(provinceName));
    } else {
      setAvailableCities([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === "edit" ? "ویرایش آدرس" : "افزودن آدرس جدید"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان آدرس <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="مثل: خانه، محل کار"
              value={addressForm.title}
              onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#286378] focus:ring-4 focus:ring-[#A2CFFF]/25 outline-none transition-all"
            />
          </div>

          {/* Province and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                استان <span className="text-red-500">*</span>
              </label>
              <select
                value={addressForm.province}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#286378] focus:ring-4 focus:ring-[#A2CFFF]/25 outline-none transition-all bg-white"
              >
                <option value="">انتخاب استان</option>
                {provinces.map((province) => (
                  <option key={province.name} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شهر <span className="text-red-500">*</span>
              </label>
              <select
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                disabled={!addressForm.province || availableCities.length === 0}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#286378] focus:ring-4 focus:ring-[#A2CFFF]/25 outline-none transition-all bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {addressForm.province ? "انتخاب شهر" : "ابتدا استان را انتخاب کنید"}
                </option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              آدرس <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="آدرس کامل"
              value={addressForm.address}
              onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#286378] focus:ring-4 focus:ring-[#A2CFFF]/25 outline-none transition-all resize-none"
            />
          </div>

          {/* Plaque and Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">پلاک</label>
              <input
                type="text"
                placeholder="پلاک"
                value={addressForm.plaque}
                onChange={(e) => setAddressForm({ ...addressForm, plaque: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#286378] focus:ring-4 focus:ring-[#A2CFFF]/25 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">واحد</label>
              <input
                type="text"
                placeholder="واحد"
                value={addressForm.unit}
                onChange={(e) => setAddressForm({ ...addressForm, unit: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#286378] focus:ring-4 focus:ring-[#A2CFFF]/25 outline-none transition-all"
              />
            </div>
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">کدپستی</label>
            <input
              type="text"
              placeholder="کدپستی"
              value={addressForm.postalCode}
              onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#286378] focus:ring-4 focus:ring-[#A2CFFF]/25 outline-none transition-all"
            />
          </div>

          {/* Is Default */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isDefault"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
              className="w-5 h-5 text-[#286378] border-gray-300 rounded focus:ring-[#286378]"
            />
            <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer">
              تنظیم به عنوان آدرس پیش‌فرض
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            انصراف
          </button>
          <button
            onClick={onSave}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-[#286378] to-[#43909A] text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>ذخیره</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

