"use client";

import { User } from "lucide-react";

/**
 * OrderCustomerInfo Component
 * Customer information section
 */
export default function OrderCustomerInfo({ order }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <User className="w-5 h-5 text-[#286378]" />
        <h3 className="text-lg font-bold text-gray-900">اطلاعات مشتری</h3>
      </div>
      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium text-gray-700">نام:</span> {order.user?.name || "-"}
        </p>
        <p>
          <span className="font-medium text-gray-700">تلفن:</span> {order.user?.phone || "-"}
        </p>
        {order.user?.email && (
          <p>
            <span className="font-medium text-gray-700">ایمیل:</span> {order.user.email}
          </p>
        )}
      </div>
    </div>
  );
}

