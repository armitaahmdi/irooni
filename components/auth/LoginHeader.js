"use client";

import Image from "next/image";
import Link from "next/link";

export default function LoginHeader({ step }) {
  return (
    <div className="px-6 pt-8 pb-6 text-center border-b border-slate-100">
      <Link href="/" className="inline-flex justify-center mb-4">
        <div className="w-16 h-16 rounded-2xl border border-slate-200 bg-white flex items-center justify-center shadow-sm">
          <Image
            src="/logo/main-logo.png"
            alt="ایرونی"
            width={48}
            height={48}
            priority
          />
        </div>
      </Link>

      <h1 className="text-xl font-semibold text-slate-900">
        ورود / ثبت‌نام
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        {step === "phone"
          ? "با شماره موبایل وارد حساب کاربری شوید"
          : "کد تأیید ارسال‌شده را وارد کنید"}
      </p>

      {step === "phone" && (
        <p className="mt-3 text-xs text-slate-400">
          با وارد کردن شماره موبایل، حساب کاربری ساخته می‌شود
        </p>
      )}
    </div>
  );
}
