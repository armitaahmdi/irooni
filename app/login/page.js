"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { useLogin } from "@/hooks/useLogin";
import LoginHeader from "@/components/auth/LoginHeader";
import PhoneStep from "@/components/auth/PhoneStep";
import OTPStep from "@/components/auth/OTPStep";

export default function LoginPage() {
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const login = useLogin();

  useEffect(() => {
    document.title = "ورود | پوشاک ایرونی";
  }, []);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 pt-20 sm:pt-24 px-4 relative overflow-hidden">
      {/* Clean minimal background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {/* Subtle geometric patterns */}
        <div className="absolute top-20 right-10 w-64 h-64 border border-blue-200/40 rotate-45 opacity-30 rounded-lg"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-indigo-100/30 to-blue-100/30 rotate-12 rounded-full opacity-25"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-indigo-200/30 rotate-30 opacity-20 rounded-full"></div>
      </div>
      <div className="w-full max-w-md sm:max-w-lg relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
          <LoginHeader step={login.step} />

          {error && (
            <div className="mx-5 sm:mx-6 mt-4 p-3.5 sm:p-4 text-sm rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="flex-1">{error}</span>
            </div>
          )}

          <div className="px-5 sm:px-6 pt-6 sm:pt-8 pb-8 sm:pb-10">
            {login.step === "phone" && (
              <PhoneStep
                phoneNumber={login.phoneNumber}
                setPhoneNumber={login.setPhoneNumber}
                onSubmit={login.handlePhoneSubmit}
                isLoading={isLoading}
              />
            )}

            {login.step === "otp" && (
              <OTPStep
                phoneNumber={login.phoneNumber}
                otp={login.otp}
                otpInputRefs={login.otpInputRefs}
                countdown={login.countdown}
                isLoading={isLoading}
                onOtpChange={login.handleOtpChange}
                onOtpKeyDown={login.handleOtpKeyDown}
                onOtpPaste={login.handleOtpPaste}
                onSubmit={login.handleOtpSubmit}
                onResend={login.handleResendOtp}
                onBack={login.handleBackToPhone}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
