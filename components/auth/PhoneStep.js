"use client";

import { Smartphone, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function PhoneStep({ phoneNumber, setPhoneNumber, onSubmit, isLoading }) {
  const [touched, setTouched] = useState(false);
  const isValid = phoneNumber.length === 11 && /^09\d{9}$/.test(phoneNumber);
  const showError = touched && phoneNumber.length > 0 && !isValid;

  return (
    <form onSubmit={onSubmit} className="space-y-6 animate-fadeIn">
      <div className="space-y-3">
        <label htmlFor="phone-input" className="block text-sm font-semibold text-slate-800 mb-3">
          شماره موبایل
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400 z-10">
            <Smartphone className="w-5 h-5" />
          </div>
          <input
            id="phone-input"
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setTouched(true);
            }}
            onBlur={() => setTouched(true)}
            placeholder="09123456789"
            maxLength={11}
            className={`w-full pl-10 pr-12 py-3.5 md:py-4 text-base md:text-lg font-medium border rounded-xl focus:ring-4 outline-none transition-all duration-300 bg-white ${
              showError
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : isValid
                ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
            }`}
            required
            dir="ltr"
            aria-invalid={showError}
            aria-describedby={showError ? "phone-error" : isValid ? "phone-success" : "phone-hint"}
          />
          {isValid && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 z-10" id="phone-success" aria-label="شماره موبایل معتبر">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
        </div>
        {showError && (
          <div id="phone-error" className="flex items-center gap-2 text-xs text-red-600 mt-2" role="alert">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>شماره موبایل باید 11 رقم و با 09 شروع شود</span>
          </div>
        )}
        {!showError && (
          <p id="phone-hint" className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span>کد تأیید به این شماره ارسال خواهد شد</span>
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full py-3.5 md:py-4 min-h-[44px] bg-slate-900 text-white text-sm md:text-base font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        aria-label="ادامه و ارسال کد تأیید"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
            <span>در حال ارسال...</span>
          </>
        ) : (
          <>
            <span>ادامه</span>
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
