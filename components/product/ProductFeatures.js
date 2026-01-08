"use client";

import { Truck, Shield, Package, Star } from "lucide-react";

/**
 * ProductFeatures Component
 * Displays product features (shipping, warranty, packaging, quality)
 */
export default function ProductFeatures() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gradient-to-br from-blue-50/70 to-blue-100/40 rounded-xl border border-blue-200/50 shadow-sm backdrop-blur-sm">
        <div className="w-9 h-9 bg-blue-100/80 rounded-lg flex items-center justify-center flex-shrink-0">
          <Truck className="w-4 h-4 text-blue-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-900">ارسال سریع</p>
          <p className="text-xs text-gray-500">1-3 روز کاری</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gradient-to-br from-green-50/70 to-green-100/40 rounded-xl border border-green-200/50 shadow-sm backdrop-blur-sm">
        <div className="w-9 h-9 bg-green-100/80 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-green-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-900">ضمانت اصالت</p>
          <p className="text-xs text-gray-500">100% اصل</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gradient-to-br from-purple-50/70 to-purple-100/40 rounded-xl border border-purple-200/50 shadow-sm backdrop-blur-sm">
        <div className="w-9 h-9 bg-purple-100/80 rounded-lg flex items-center justify-center flex-shrink-0">
          <Package className="w-4 h-4 text-purple-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-900">بسته‌بندی مناسب</p>
          <p className="text-xs text-gray-500">محافظت شده</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gradient-to-br from-orange-50/70 to-orange-100/40 rounded-xl border border-orange-200/50 shadow-sm backdrop-blur-sm">
        <div className="w-9 h-9 bg-orange-100/80 rounded-lg flex items-center justify-center flex-shrink-0">
          <Star className="w-4 h-4 text-orange-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-900">کیفیت عالی</p>
          <p className="text-xs text-gray-500">تضمین شده</p>
        </div>
      </div>
    </div>
  );
}

