"use client";

import { CreditCard, CheckCircle } from "lucide-react";

/**
 * PaymentMethodSelection Component
 * Payment method selection for checkout
 */
export default function PaymentMethodSelection({
  paymentMethod,
  setPaymentMethod,
}) {
  const paymentMethods = [
    {
      value: "zarinpal",
      title: "زرین‌پال",
      description: "پرداخت آنلاین از طریق درگاه زرین‌پال",
    },
    {
      value: "payping",
      title: "پی‌پینگ",
      description: "پرداخت آنلاین از طریق درگاه پی‌پینگ",
    },
  ];

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-[#286378]" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">روش پرداخت</h2>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.value}
            className={`block p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
              paymentMethod === method.value
                ? "border-[#286378] bg-[#286378]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.value}
              checked={paymentMethod === method.value}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  paymentMethod === method.value
                    ? "border-[#286378] bg-[#286378]"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === method.value && (
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900">{method.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{method.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

