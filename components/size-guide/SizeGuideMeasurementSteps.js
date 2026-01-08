"use client";

import { measurementSteps } from "@/data/sizeGuideData";

/**
 * SizeGuideMeasurementSteps Component
 * Measurement guide steps
 */
export default function SizeGuideMeasurementSteps() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            نحوه اندازه‌گیری
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            برای اندازه‌گیری دقیق، این مراحل را دنبال کنید
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {measurementSteps.map((step) => (
            <div
              key={step.number}
              className={`text-center bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow ${
                step.colSpan || ""
              }`}
            >
              <div
                className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
              >
                <span className="text-3xl font-bold text-white">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

