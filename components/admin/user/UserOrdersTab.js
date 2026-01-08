"use client";

import { Package } from "lucide-react";
import { formatDate } from "@/utils/reviewHelpers";
import { formatPrice, getStatusBadge } from "@/utils/orderHelpers";

/**
 * UserOrdersTab Component
 * User orders tab content
 */
export default function UserOrdersTab({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">این کاربر هنوز سفارشی ثبت نکرده است</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const statusBadge = getStatusBadge(order.status);
        return (
          <div
            key={order.id}
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#286378] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">سفارش {order.orderNumber}</h4>
                <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
                <span className="text-lg font-bold text-[#286378]">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-medium">تعداد آیتم:</span> {order.items?.length || 0}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

