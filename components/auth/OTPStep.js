"use client";

import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function OTPStep({
  phoneNumber,
  otp,
  otpInputRefs,
  countdown,
  isLoading,
  onOtpChange,
  onOtpKeyDown,
  onOtpPaste,
  onSubmit,
  onResend,
  onBack,
}) {
  const otpValue = otp.join("");
  const isComplete = otpValue.length === 6;
  const hasError = otpValue.length > 0 && otpValue.length < 6;

  return (
    <form onSubmit={onSubmit} className="space-y-6 animate-fadeIn">
      <div className="space-y-5">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <p className="text-xs text-green-700 font-medium">کد ارسال شد</p>
          </div>
          <p className="text-sm md:text-base text-slate-700 mb-1">کد تأیید به شماره</p>
          <p className="text-base md:text-lg font-bold text-slate-900">{phoneNumber}</p>
        </div>

        <div className="w-full">
          <label htmlFor="otp-input-0" className="block text-sm font-semibold text-slate-800 mb-3 text-center">
            کد تأیید را وارد کنید
          </label>
          <div className="w-full grid grid-cols-6 gap-2 md:gap-2.5 px-1" dir="ltr">
            {otp.map((digit, index) => {
              const isFilled = digit.length > 0;
              const isActive = index === otpValue.length;
              return (
                <input
                  key={index}
                  id={index === 0 ? "otp-input-0" : undefined}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => onOtpChange(index, e.target.value)}
                  onKeyDown={(e) => onOtpKeyDown(index, e)}
                  onPaste={onOtpPaste}
                  className={`w-full aspect-square h-12 md:h-14 min-h-[44px] text-center text-xl md:text-2xl font-bold border rounded-xl focus:ring-4 outline-none transition-all duration-300 bg-white ${
                isFilled && isComplete
                  ? "border-green-400 bg-green-50 focus:border-green-500 focus:ring-green-100"
                  : isFilled
                  ? "border-blue-400 focus:border-blue-500 focus:ring-blue-100"
                  : hasError
                  ? "border-red-200 focus:border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
              }`}
                  dir="ltr"
                  aria-label={`رقم ${index + 1} کد تأیید`}
                  aria-invalid={hasError && !isFilled}
                />
              );
            })}
          </div>
          {hasError && (
            <div className="flex items-center justify-center gap-2 text-xs text-red-600 mt-3" role="alert">
              <AlertCircle className="w-4 h-4" />
              <span>لطفاً تمام 6 رقم را وارد کنید</span>
            </div>
          )}
          {isComplete && (
            <div className="flex items-center justify-center gap-2 text-xs text-green-600 mt-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>کد تأیید کامل است</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors min-h-[44px] px-2"
            aria-label="تغییر شماره موبایل"
          >
            <ArrowRight className="w-4 h-4" />
            <span>تغییر شماره موبایل</span>
          </button>

          <button
            type="button"
            onClick={onResend}
            disabled={countdown > 0 || isLoading}
            className="text-slate-900 hover:text-slate-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] px-2"
            aria-label={countdown > 0 ? `ارسال مجدد کد در ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, "0")}` : "ارسال مجدد کد تأیید"}
          >
            {countdown > 0 ? (
              <span>
                ارسال مجدد ({Math.floor(countdown / 60)}:
                {(countdown % 60).toString().padStart(2, "0")})
              </span>
            ) : (
              <span>ارسال مجدد کد</span>
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isComplete || isLoading}
        className="w-full py-3.5 md:py-4 min-h-[44px] bg-slate-900 text-white text-sm md:text-base font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        aria-label="ورود به حساب کاربری"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
            <span>در حال تأیید...</span>
          </>
        ) : (
          <>
            <span>ورود</span>
            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
