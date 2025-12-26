"use client";

/**
 * SettingsSection Component
 * User settings section
 */
export default function SettingsSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#286378] mb-6">تنظیمات</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-medium text-gray-800">اعلان‌های پیامکی</p>
            <p className="text-sm text-gray-600">دریافت اطلاع‌رسانی از طریق پیامک</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#A2CFFF]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#286378]"></div>
          </label>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-medium text-gray-800">اعلان‌های ایمیل</p>
            <p className="text-sm text-gray-600">دریافت اطلاع‌رسانی از طریق ایمیل</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#A2CFFF]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#286378]"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

