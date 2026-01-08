"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Search, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  // Set document title on client side
  useEffect(() => {
    document.title = "صفحه پیدا نشد | پوشاک ایرونی";
  }, []);
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <Image
              src="/logo/main-logo.png"
              alt="لوگو پوشاک ایرونی"
              width={160}
              height={160}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
        </div>

        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-[#286378] to-[#43909A] bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            صفحه مورد نظر پیدا نشد
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-gradient-to-br from-[#286378]/10 to-[#43909A]/10 rounded-full blur-3xl"></div>
          </div>
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-br from-[#286378] to-[#43909A] rounded-full flex items-center justify-center shadow-2xl">
              <Search className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group flex items-center gap-2 bg-gradient-to-r from-[#286378] to-[#43909A] text-white font-bold px-8 py-4 rounded-xl hover:from-[#43909A] hover:to-[#286378] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            بازگشت به صفحه اصلی
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-2 bg-white text-[#286378] font-bold px-8 py-4 rounded-xl border-2 border-[#286378] hover:bg-[#286378] hover:text-white transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
          >
            <Search className="w-5 h-5" />
            مشاهده محصولات
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">صفحات مفید:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/products"
              className="text-[#286378] hover:text-[#43909A] transition-colors"
            >
              همه محصولات
            </Link>
            <Link
              href="/about"
              className="text-[#286378] hover:text-[#43909A] transition-colors"
            >
              درباره ما
            </Link>
            <Link
              href="/contact"
              className="text-[#286378] hover:text-[#43909A] transition-colors"
            >
              تماس با ما
            </Link>
            <Link
              href="/blogs"
              className="text-[#286378] hover:text-[#43909A] transition-colors"
            >
              مجله
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

