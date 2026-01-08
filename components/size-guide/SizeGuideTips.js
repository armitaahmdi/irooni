"use client";

import { tips } from "@/data/sizeGuideData";

/**
 * SizeGuideTips Component
 * Tips section for size selection
 */
export default function SizeGuideTips() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            نکات مهم برای انتخاب سایز
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#286378] to-[#43909A] rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#286378] to-[#43909A] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {tip.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-[#286378] transition-colors duration-300">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {tip.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

