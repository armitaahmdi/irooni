"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Shield } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import PaymentGateway from "@/components/payment/PaymentGateway";
import PaymentSummary from "@/components/payment/PaymentSummary";

export default function PaymentPage() {
  const { order, isLoading, isProcessing, isInitialized, authLoading, isAuthenticated, handlePayment } =
    usePayment();

  if (!isInitialized || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#286378] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بررسی...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || isLoading || !order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#286378] mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            بازگشت به تکمیل سفارش
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">پرداخت سفارش</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PaymentGateway order={order} isProcessing={isProcessing} onPayment={handlePayment} />

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">امنیت پرداخت</h3>
                  <p className="text-sm text-blue-700">
                    تمامی پرداخت‌ها از طریق درگاه‌های معتبر و امن انجام می‌شود. اطلاعات کارت
                    بانکی شما نزد ما ذخیره نمی‌شود.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <PaymentSummary order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}
