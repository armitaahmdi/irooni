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
    <div className="min-h-screen flex items-start justify-center bg-linear-to-b from-slate-50 via-white to-slate-100 pt-24 px-4">
      <div className="w-full max-w-[380px]">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <LoginHeader step={login.step} />

          {error && (
            <div className="mx-5 mt-4 p-3 text-sm rounded-xl bg-red-50 border border-red-200 text-red-600">
              {error}
            </div>
          )}

          <div className="px-5 pt-6 pb-8">
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
