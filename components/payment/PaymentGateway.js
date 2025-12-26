"use client";

import { CreditCard, Loader2, Lock, Shield } from "lucide-react";
import { formatPrice } from "@/utils/orderHelpers";

export default function PaymentGateway({ order, isProcessing, onPayment }) {
  const getPaymentMethodLabel = (method) => {
    if (method === "zarinpal") return "زرین‌پال";
    if (method === "payping") return "پی‌پینگ";
    return "درگاه پرداخت";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-6 h-6 text-[#286378]" />
        <h2 className="text-xl font-bold text-gray-900">درگاه پرداخت امن</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Shield className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-semibold text-gray-900">{getPaymentMethodLabel(order.paymentMethod)}</p>
            <p className="text-sm text-gray-600">پرداخت امن و سریع از طریق درگاه معتبر</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>شماره سفارش:</span>
              <span className="font-semibold text-gray-900">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>مبلغ قابل پرداخت:</span>
              <span className="font-bold text-lg text-[#286378]">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onPayment}
          disabled={isProcessing || order.paymentStatus === "paid"}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#286378] to-[#43909A] text-white font-bold py-4 rounded-xl hover:from-[#43909A] hover:to-[#286378] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>در حال اتصال به درگاه پرداخت...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>ورود به درگاه پرداخت</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          با کلیک روی دکمه بالا، به صفحه پرداخت امن هدایت می‌شوید
        </p>
      </div>
    </div>
  );
}

