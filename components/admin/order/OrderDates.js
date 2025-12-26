"use client";

import { Calendar } from "lucide-react";
import { formatDate } from "@/utils/reviewHelpers";

/**
 * OrderDates Component
 * Order dates information
 */
export default function OrderDates({ order }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-5 h-5 text-[#286378]" />
        <h3 className="text-lg font-bold text-gray-900">تاریخ‌ها</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium text-gray-700">تاریخ سفارش:</span>
          <p className="text-gray-600">{formatDate(order.createdAt)}</p>
        </div>
        {order.shippedAt && (
          <div>
            <span className="font-medium text-gray-700">تاریخ ارسال:</span>
            <p className="text-gray-600">{formatDate(order.shippedAt)}</p>
          </div>
        )}
        {order.deliveredAt && (
          <div>
            <span className="font-medium text-gray-700">تاریخ تحویل:</span>
            <p className="text-gray-600">{formatDate(order.deliveredAt)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

