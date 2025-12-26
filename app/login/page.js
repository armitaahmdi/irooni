"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { useLogin } from "@/hooks/useLogin";
import LoginHeader from "@/components/auth/LoginHeader";
import PhoneStep from "@/components/auth/PhoneStep";
import OTPStep from "@/components/auth/OTPStep";

export default function LoginPage() {
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const {
    step,
    phoneNumber,
    setPhoneNumber,
    otp,
    countdown,
    otpInputRefs,
    handlePhoneSubmit,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    handleOtpSubmit,
    handleResendOtp,
    handleBackToPhone,
  } = useLogin();

  useEffect(() => {
    document.title = "ورود | پوشاک ایرونی";
  }, []);

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-8 sm:py-10">
      <div className="max-w-sm sm:max-w-md lg:max-w-md xl:max-w-[420px]">
        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] overflow-hidden">
          <LoginHeader step={step} />

          {error && (
            <div className="mx-5 sm:mx-6 md:mx-8 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="px-5 sm:px-6 md:px-8 pb-6 md:pb-8">
            {step === "phone" && (
              <PhoneStep
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                onSubmit={handlePhoneSubmit}
                isLoading={isLoading}
              />
            )}

            {step === "otp" && (
              <OTPStep
                phoneNumber={phoneNumber}
                otp={otp}
                otpInputRefs={otpInputRefs}
                countdown={countdown}
                isLoading={isLoading}
                onOtpChange={handleOtpChange}
                onOtpKeyDown={handleOtpKeyDown}
                onOtpPaste={handleOtpPaste}
                onSubmit={handleOtpSubmit}
                onResend={handleResendOtp}
                onBack={handleBackToPhone}
              />
            )}
          </div>

          <div className="text-center pb-6 px-5 sm:px-6 md:px-8 text-xs md:text-sm text-slate-500 border-t border-slate-100 pt-6">
            <p>
              با ورود به سایت،{" "}
              <a
                href="#"
                className="text-slate-800 hover:text-slate-600 font-semibold transition-colors duration-200 underline-offset-2 hover:underline"
              >
                قوانین و مقررات
              </a>{" "}
              را می‌پذیرید
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
