"use client";

import Image from "next/image";
import Link from "next/link";

export default function LoginHeader({ step }) {
  return (
    <div className="text-center px-6 md:px-8 pt-6 md:pt-8 pb-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#E9F3FF] via-white to-[#F7FBFF] border border-white shadow-sm">
        <div className="absolute -top-10 -right-12 w-32 h-32 rounded-full bg-[#A2CFFF]/40 blur-3xl"></div>
        <div className="absolute top-10 -left-10 w-24 h-24 rounded-full bg-[#FFD7B5]/40 blur-3xl"></div>
        <div className="relative px-5 md:px-6 pt-6 md:pt-7 pb-5">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="hover:opacity-80 transition-opacity duration-300">
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-lg border border-[#A2CFFF]/30 p-2 cursor-pointer hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/logo/main-logo.png"
                  alt="ایرونی"
                  width={100}
                  height={100}
                  priority
                  quality={100}
                  className="w-full h-full object-contain rounded-xl"
                  unoptimized
                />
              </div>
            </Link>
            <div className="flex flex-col items-end text-right">
              <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#286378] to-[#43909A] bg-clip-text text-transparent">
                ورود / ثبت‌نام
              </h1>
              <p className="text-gray-600 text-xs md:text-sm mt-1">
                {step === "phone"
                  ? "با شماره موبایل وارد شوید"
                  : "کد تأیید ارسال‌شده را وارد کنید"}
              </p>
            </div>
          </div>

          <div className="mt-5 relative h-32 md:h-40 rounded-2xl overflow-hidden border border-white/70 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"></div>
            <Image
              src="/banners/outfit-banner.png"
              alt="استایل‌های جدید"
              fill
              sizes="(max-width: 768px) 320px, 420px"
              className="object-cover"
              priority
            />
            <div className="relative flex items-end justify-between px-4 py-3 text-white">
              <div className="text-sm md:text-base font-semibold">استایل‌های تازه</div>
              <div className="text-xs md:text-sm bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                خرید آسان
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm text-[#286378]">
            <span className="px-3 py-1 rounded-full bg-white/70 border border-white shadow-sm">
              ارسال سریع
            </span>
            <span className="px-3 py-1 rounded-full bg-white/70 border border-white shadow-sm">
              پرداخت امن
            </span>
            <span className="px-3 py-1 rounded-full bg-white/70 border border-white shadow-sm">
              تنوع برند
            </span>
          </div>
        </div>
      </div>

      {step === "phone" && (
        <p className="text-xs text-gray-500 mt-4">
          اگر حساب کاربری ندارید، با وارد کردن شماره موبایل ثبت‌نام می‌شوید
        </p>
      )}
    </div>
  );
}
