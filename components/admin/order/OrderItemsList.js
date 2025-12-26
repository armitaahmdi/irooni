"use client";

import Image from "next/image";
import { formatPrice } from "@/utils/orderHelpers";

/**
 * OrderItemsList Component
 * Order items list with total
 */
export default function OrderItemsList({ items, totalAmount }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">محصولات سفارش</h3>
      <div className="space-y-4">
        {items?.map((item) => (
          <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={item.productImage}
                alt={item.productName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{item.productName}</h4>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>تعداد: {item.quantity}</span>
                {item.size && <span>سایز: {item.size}</span>}
                {item.color && <span>رنگ: {item.color}</span>}
              </div>
              <p className="text-lg font-bold text-[#286378] mt-2">
                {formatPrice(item.subtotal)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
        <span className="text-lg font-bold text-gray-900">جمع کل:</span>
        <span className="text-2xl font-bold text-[#286378]">{formatPrice(totalAmount)}</span>
      </div>
    </div>
  );
}

