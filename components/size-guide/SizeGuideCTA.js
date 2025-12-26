"use client";

import Link from "next/link";

/**
 * SizeGuideCTA Component
 * Call to action section
 */
export default function SizeGuideCTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#286378] to-[#43909A] text-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">هنوز مطمئن نیستید؟</h2>
        <p className="text-lg md:text-xl text-gray-100 mb-8">
          تیم پشتیبانی ما آماده است تا شما را در انتخاب سایز مناسب راهنمایی کند
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#286378] font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            تماس با پشتیبانی
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
          >
            مشاهده محصولات
          </Link>
        </div>
      </div>
    </section>
  );
}

