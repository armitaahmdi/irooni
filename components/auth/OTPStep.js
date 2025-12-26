"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";

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
  return (
    <form onSubmit={onSubmit} className="space-y-6 animate-fadeIn">
      <div className="space-y-5">
        <div className="text-center mb-6">
          <p className="text-sm md:text-base text-slate-700 mb-1">کد تأیید به شماره</p>
          <p className="text-base md:text-lg font-bold text-slate-900">{phoneNumber}</p>
          <p className="text-xs text-slate-500 mt-1">ارسال شد</p>
        </div>

        <div className="w-full grid grid-cols-6 gap-2 md:gap-2.5 px-1" dir="ltr">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (otpInputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => onOtpChange(index, e.target.value)}
              onKeyDown={(e) => onOtpKeyDown(index, e)}
              onPaste={onOtpPaste}
              className="w-full aspect-square h-12 md:h-14 text-center text-xl md:text-2xl font-bold border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all duration-300 bg-white"
              dir="ltr"
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>تغییر شماره موبایل</span>
          </button>

          <button
            type="button"
            onClick={onResend}
            disabled={countdown > 0 || isLoading}
            className="text-slate-900 hover:text-slate-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        disabled={otp.join("").length !== 6 || isLoading}
        className="w-full py-3.5 md:py-4 bg-slate-900 text-white text-sm md:text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>در حال تأیید...</span>
          </>
        ) : (
          <>
            <span>ورود</span>
            <CheckCircle2 className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
