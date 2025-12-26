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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#A2CFFF]/15 via-white to-[#A2CFFF]/5 px-4 py-8 md:py-12">
      <div className="w-full max-w-[420px] md:w-auto md:max-w-[450px]">
        <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
          <LoginHeader step={step} />

          {error && (
            <div className="mx-6 md:mx-8 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="px-6 md:px-8 pb-6 md:pb-8">
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

          <div className="text-center pb-6 md:pb-8 px-6 md:px-8 text-xs md:text-sm text-gray-500 border-t border-gray-100 pt-6">
            <p>
              با ورود به سایت،{" "}
              <a
                href="#"
                className="text-[#286378] hover:text-[#43909A] font-semibold transition-colors duration-200 underline-offset-2 hover:underline"
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
