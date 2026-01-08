"use client";

import { MapPin } from "lucide-react";

export default function MapContainer({ mapRef, isMapLoaded, error }) {
  if (error) {
    return (
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200"
          style={{ minHeight: "400px" }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="text-center p-6 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 font-medium mb-2">خطا در بارگذاری نقشه</p>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-right">
              <p className="text-sm font-medium text-yellow-800 mb-2">راهنمای تنظیم:</p>
              <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
                <li>
                  به{" "}
                  <a
                    href="https://platform.neshan.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    پنل نشان
                  </a>{" "}
                  بروید
                </li>
                <li>پروژه جدید ایجاد کنید</li>
                <li>API Key را دریافت کنید</li>
                <li>
                  در فایل <code className="bg-yellow-100 px-1 rounded">.env.local</code> اضافه کنید:
                </li>
              </ol>
              <code className="block mt-2 text-xs bg-yellow-100 p-2 rounded text-left">
                NEXT_PUBLIC_NESHAN_API_KEY=your_api_key_here
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200"
        style={{ minHeight: "400px" }}
      />
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378] mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری نقشه...</p>
          </div>
        </div>
      )}
    </div>
  );
}

