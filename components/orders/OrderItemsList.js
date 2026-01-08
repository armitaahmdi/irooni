"use client";

import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import { formatPrice } from "@/utils/orderHelpers";

/**
 * OrderItemsList Component
 * Displays list of order items
 */
export default function OrderItemsList({ items, totalAmount, shippingCost }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#286378] to-[#43909A] flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">محصولات سفارش</h2>
      </div>
      <div className="space-y-4">
        {items?.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
          >
            <Link
              href={`/products/${item.product?.id || item.productId}`}
              className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 hover:border-[#286378] transition-colors"
            >
              <Image
                src={item.productImage}
                alt={item.productName}
                fill
                className="object-cover"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.product?.id || item.productId}`}
                className="block"
              >
                <h3 className="font-semibold text-gray-900 hover:text-[#286378] transition-colors mb-2">
                  {item.productName}
                </h3>
              </Link>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                <span className="bg-gray-100 px-2 py-1 rounded">تعداد: {item.quantity}</span>
                {item.size && (
                  <span className="bg-gray-100 px-2 py-1 rounded">سایز: {item.size}</span>
                )}
                {item.color && (
                  <span className="bg-gray-100 px-2 py-1 rounded">رنگ: {item.color}</span>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-lg font-bold text-[#286378]">{formatPrice(item.subtotal)}</p>
                <p className="text-sm text-gray-500">
                  {formatPrice(item.productPrice)} × {item.quantity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">جمع کل محصولات:</span>
          <span className="text-xl font-bold text-[#286378]">
            {formatPrice(totalAmount - (shippingCost || 0))}
          </span>
        </div>
      </div>
    </div>
  );
}

