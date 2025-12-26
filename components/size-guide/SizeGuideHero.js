"use client";

import { Ruler } from "lucide-react";

/**
 * SizeGuideHero Component
 * Hero section for size guide page
 */
export default function SizeGuideHero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FFD60A]/20 to-[#FFD60A]/10 rounded-2xl mb-6 border border-[#FFD60A]/30">
            <Ruler className="w-10 h-10 text-[#FFD60A]" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
            راهنمای سایز
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            راهنمای کامل انتخاب سایز مناسب برای انواع پوشاک مردانه
          </p>
        </div>
      </div>
    </section>
  );
}

