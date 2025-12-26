"use client";

import { Package } from "lucide-react";
import {
  getStatusLabel,
  getStatusColor,
  getPaymentStatusLabel,
  getPaymentStatusColor,
  getPaymentMethodLabel,
} from "@/utils/orderModalHelpers";

/**
 * OrderStatusInfo Component
 * Order status information section
 */
export default function OrderStatusInfo({ order }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Package className="w-5 h-5 text-[#286378]" />
        <h3 className="text-lg font-bold text-gray-900">وضعیت سفارش</h3>
      </div>
      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium text-gray-700">وضعیت:</span>{" "}
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </p>
        <p>
          <span className="font-medium text-gray-700">وضعیت پرداخت:</span>{" "}
          <span
            className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(order.paymentStatus)}`}
          >
            {getPaymentStatusLabel(order.paymentStatus)}
          </span>
        </p>
        <p>
          <span className="font-medium text-gray-700">روش پرداخت:</span>{" "}
          {getPaymentMethodLabel(order.paymentMethod)}
        </p>
      </div>
    </div>
  );
}

