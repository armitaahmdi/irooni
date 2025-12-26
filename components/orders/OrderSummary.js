"use client";

import Link from "next/link";
import {
  Calendar,
  Truck,
  CheckCircle2,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { formatDate, formatPrice, getPaymentMethodLabel } from "@/utils/orderHelpers";

/**
 * OrderSummary Component
 * Displays order summary sidebar
 */
export default function OrderSummary({ order }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">خلاصه سفارش</h2>

      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-[#286378]" />
            <p className="text-sm font-medium text-gray-700">تاریخ سفارش</p>
          </div>
          <p className="text-sm font-semibold text-gray-900 pr-8">
            {formatDate(order.createdAt)}
          </p>
        </div>

        {order.shippedAt && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Truck className="w-5 h-5 text-[#286378]" />
              <p className="text-sm font-medium text-gray-700">تاریخ ارسال</p>
            </div>
            <p className="text-sm font-semibold text-gray-900 pr-8">
              {formatDate(order.shippedAt)}
            </p>
          </div>
        )}

        {order.deliveredAt && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-gray-700">تاریخ تحویل</p>
            </div>
            <p className="text-sm font-semibold text-gray-900 pr-8">
              {formatDate(order.deliveredAt)}
            </p>
          </div>
        )}

        {order.trackingNumber && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 border-2 border-blue-300 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-900">شماره پیگیری پست</p>
            </div>
            <p className="text-base font-bold text-gray-900 font-mono pr-8 mt-2 bg-white px-3 py-2 rounded border border-blue-200">
              {order.trackingNumber}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              می‌توانید با این شماره سفارش خود را در سایت پست ایران رهگیری کنید
            </p>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-[#286378]" />
            <p className="text-sm font-medium text-gray-700">روش پرداخت</p>
          </div>
          <p className="text-sm font-semibold text-gray-900 pr-8">
            {getPaymentMethodLabel(order.paymentMethod)}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-gray-700">
            <span className="text-sm">جمع کل محصولات:</span>
            <span className="font-semibold text-base">
              {formatPrice(order.totalAmount - (order.shippingCost || 0))}
            </span>
          </div>
          {order.shippingCost > 0 && (
            <div className="flex justify-between items-center text-gray-700">
              <span className="text-sm">هزینه ارسال:</span>
              <span className="font-semibold text-base">{formatPrice(order.shippingCost)}</span>
            </div>
          )}
          <div className="border-t-2 border-gray-300 pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">مبلغ کل:</span>
            <span className="text-2xl font-bold text-[#286378]">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {order.paymentStatus === "unpaid" && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            href={`/payment/${order.id}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#286378] to-[#43909A] text-white rounded-lg hover:from-[#43909A] hover:to-[#286378] transition-all shadow-md hover:shadow-lg font-semibold"
          >
            <CreditCard className="w-5 h-5" />
            پرداخت سفارش
          </Link>
        </div>
      )}
    </div>
  );
}

