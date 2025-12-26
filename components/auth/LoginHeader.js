"use client";

import Image from "next/image";
import Link from "next/link";

export default function LoginHeader({ step }) {
  return (
    <div className="text-center pt-8 pb-6 md:pt-8 md:pb-6 px-6 md:px-8">
      <div className="inline-flex items-center justify-center mb-4">
        <Link href="/" className="hover:opacity-80 transition-opacity duration-300">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-white shadow-lg border border-[#A2CFFF]/30 p-2 cursor-pointer hover:shadow-xl transition-shadow duration-300">
            <Image
              src="/logo/main-logo.png"
              alt="ایرونی"
              width={100}
              height={100}
              priority
              quality={100}
              className="w-full h-full object-contain rounded-2xl"
              unoptimized
            />
          </div>
        </Link>
      </div>
      <h1 className="text-2xl md:text-2xl font-extrabold bg-gradient-to-r from-[#286378] to-[#43909A] bg-clip-text text-transparent mb-2">
        ورود / ثبت‌نام
      </h1>
      <p className="text-gray-600 text-sm md:text-sm">
        {step === "phone"
          ? "لطفاً شماره موبایل خود را وارد کنید"
          : "کد تأیید ارسال شده را وارد کنید"}
      </p>
      {step === "phone" && (
        <p className="text-xs text-gray-500 mt-1">
          اگر حساب کاربری ندارید، با وارد کردن شماره موبایل ثبت‌نام می‌شوید
        </p>
      )}
    </div>
  );
}

