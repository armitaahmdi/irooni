"use client";

import { Smartphone, ArrowLeft } from "lucide-react";

export default function PhoneStep({ phoneNumber, setPhoneNumber, onSubmit, isLoading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 animate-fadeIn">
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800 mb-3">شماره موبایل</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500 z-10">
            <Smartphone className="w-5 h-5" />
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="09123456789"
            maxLength={11}
            className="w-full pl-10 pr-4 py-3.5 md:py-4 text-base md:text-lg font-medium border-2 border-gray-200 rounded-xl md:rounded-2xl focus:border-[#286378] focus:ring-4 focus:ring-[#A2CFFF]/25 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white"
            required
            dir="ltr"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <span>کد تأیید به این شماره ارسال خواهد شد</span>
        </p>
      </div>

      <button
        type="submit"
        disabled={phoneNumber.length !== 11 || isLoading}
        className="w-full py-3.5 md:py-4 bg-gradient-to-r from-[#286378] to-[#43909A] text-white text-sm md:text-base font-semibold rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>در حال ارسال...</span>
          </>
        ) : (
          <>
            <span>ادامه</span>
            <ArrowLeft className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}

