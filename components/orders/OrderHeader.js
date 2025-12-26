"use client";

import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { getStatusBadge, getPaymentStatusBadge } from "@/utils/orderHelpers";

/**
 * OrderHeader Component
 * Displays order header with order number and status badges
 */
export default function OrderHeader({ order }) {
  const statusBadge = getStatusBadge(order.status, order.paymentStatus);
  const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
  const StatusIcon = statusBadge.icon || Package;

  return (
    <div className="mb-8">
      <Link
        href="/profile?section=orders"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#286378] mb-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        بازگشت به سفارش‌ها
      </Link>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              جزئیات سفارش
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              شماره سفارش:{" "}
              <span className="font-semibold text-gray-900">{order.orderNumber}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
              <StatusIcon className="w-4 h-4 text-gray-600" />
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
            </div>
            <span className={`px-4 py-2 text-xs font-medium rounded-full ${paymentBadge.color}`}>
              {paymentBadge.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

