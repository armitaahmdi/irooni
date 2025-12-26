"use client";

import Image from "next/image";
import Link from "next/link";

export default function LoginHeader({ step }) {
  return (
    <div className="text-center px-6 md:px-8 pt-8 pb-6">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="hover:opacity-80 transition-opacity duration-300">
          <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 border border-slate-200 p-2 shadow-sm">
            <Image
              src="/logo/main-logo.png"
              alt="ایرونی"
              width={96}
              height={96}
              priority
              quality={100}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
        </Link>
        <div className="flex flex-col items-end text-right">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            ورود / ثبت‌نام
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            {step === "phone"
              ? "با شماره موبایل وارد شوید"
              : "کد تأیید ارسال‌شده را وارد کنید"}
          </p>
        </div>
      </div>

      <div className="mt-6 h-px bg-gradient-to-l from-transparent via-slate-200 to-transparent" />

      {step === "phone" && (
        <p className="text-xs text-slate-500 mt-4">
          اگر حساب کاربری ندارید، با وارد کردن شماره موبایل ثبت‌نام می‌شوید
        </p>
      )}
    </div>
  );
}
