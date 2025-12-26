"use client";

import { formatPrice } from "@/utils/orderHelpers";

export default function PaymentSummary({ order }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">خلاصه سفارش</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>جمع کل:</span>
          <span className="font-semibold">
            {formatPrice(order.totalAmount - (order.shippingCost || 0))}
          </span>
        </div>
        {order.shippingCost > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>هزینه ارسال:</span>
            <span className="font-semibold">{formatPrice(order.shippingCost)}</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-900">
          <span>مبلغ قابل پرداخت:</span>
          <span className="text-[#286378]">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      {order.items && order.items.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">محصولات ({order.items.length})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {order.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.productImage && (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.productName}</p>
                  <p className="text-gray-500">
                    {item.quantity} × {formatPrice(item.productPrice)}
                  </p>
                </div>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-sm text-gray-500 text-center pt-2">
                و {order.items.length - 3} محصول دیگر...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

