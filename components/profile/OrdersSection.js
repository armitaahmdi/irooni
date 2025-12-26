"use client";

import Link from "next/link";
import {
  Package,
  X,
  Clock,
  Loader2,
  Truck,
  CheckCircle2,
  RotateCcw,
  CreditCard,
} from "lucide-react";

/**
 * OrdersSection Component
 * Orders list with filtering
 */
export default function OrdersSection({
  orders,
  orderFilter,
  setOrderFilter,
  orderStats,
  isLoading,
}) {
  const filteredOrders = orderFilter
    ? orders.filter((order) => {
        switch (orderFilter) {
          case "pendingPayment":
            return order.paymentStatus === "unpaid";
          case "processing":
            return order.paymentStatus === "paid" && order.status === "processing";
          case "shipped":
            return order.status === "shipped";
          case "delivered":
            return order.status === "delivered";
          case "refunded":
            return order.paymentStatus === "refunded" || order.status === "cancelled";
          default:
            return true;
        }
      })
    : orders;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">سفارش‌های من</h2>
        {orderFilter && (
          <button
            onClick={() => setOrderFilter(null)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            نمایش همه
          </button>
        )}
      </div>

      {/* Order Stats Filter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <button
          onClick={() => setOrderFilter(orderFilter === "pendingPayment" ? null : "pendingPayment")}
          className={`bg-white rounded-lg p-5 border transition-all duration-200 text-right w-full ${
            orderFilter === "pendingPayment"
              ? "border-orange-500 shadow-lg ring-2 ring-orange-200"
              : "border-gray-200 hover:border-orange-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              orderFilter === "pendingPayment" ? "bg-orange-100" : "bg-orange-50"
            }`}>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">در انتظار پرداخت</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.pendingPayment}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setOrderFilter(orderFilter === "processing" ? null : "processing")}
          className={`bg-white rounded-lg p-5 border transition-all duration-200 text-right w-full ${
            orderFilter === "processing"
              ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
              : "border-gray-200 hover:border-blue-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              orderFilter === "processing" ? "bg-blue-100" : "bg-blue-50"
            }`}>
              <Loader2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">در حال پردازش</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.processing}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setOrderFilter(orderFilter === "shipped" ? null : "shipped")}
          className={`bg-white rounded-lg p-5 border transition-all duration-200 text-right w-full ${
            orderFilter === "shipped"
              ? "border-purple-500 shadow-lg ring-2 ring-purple-200"
              : "border-gray-200 hover:border-purple-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              orderFilter === "shipped" ? "bg-purple-100" : "bg-purple-50"
            }`}>
              <Truck className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">ارسال شده</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.shipped}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setOrderFilter(orderFilter === "delivered" ? null : "delivered")}
          className={`bg-white rounded-lg p-5 border transition-all duration-200 text-right w-full ${
            orderFilter === "delivered"
              ? "border-green-500 shadow-lg ring-2 ring-green-200"
              : "border-gray-200 hover:border-green-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              orderFilter === "delivered" ? "bg-green-100" : "bg-green-50"
            }`}>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">تحویل شده</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.delivered}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setOrderFilter(orderFilter === "refunded" ? null : "refunded")}
          className={`bg-white rounded-lg p-5 border transition-all duration-200 text-right w-full ${
            orderFilter === "refunded"
              ? "border-red-500 shadow-lg ring-2 ring-red-200"
              : "border-gray-200 hover:border-red-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              orderFilter === "refunded" ? "bg-red-100" : "bg-red-50"
            }`}>
              <RotateCcw className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">مرجوعی</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.refunded}</p>
            </div>
          </div>
        </button>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378]"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">
            {orderFilter ? "سفارشی در این دسته‌بندی یافت نشد" : "شما هنوز سفارشی ثبت نکرده‌اید"}
          </p>
          {orderFilter && (
            <button
              onClick={() => setOrderFilter(null)}
              className="inline-block mt-4 text-[#286378] hover:text-[#43909A] font-semibold"
            >
              نمایش همه سفارش‌ها
            </button>
          )}
          {!orderFilter && (
            <Link
              href="/"
              className="inline-block mt-4 text-[#286378] hover:text-[#43909A] font-semibold"
            >
              شروع خرید
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#286378] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <Link href={`/orders/${order.id}`} className="flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      سفارش {order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Intl.DateTimeFormat("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(order.createdAt))}
                    </p>
                  </div>
                </Link>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "shipped"
                        ? "bg-purple-100 text-purple-800"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.paymentStatus === "unpaid"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status === "delivered"
                      ? "تحویل داده شده"
                      : order.status === "shipped"
                      ? "ارسال شده"
                      : order.status === "processing"
                      ? "در حال پردازش"
                      : order.paymentStatus === "unpaid"
                      ? "در انتظار پرداخت"
                      : "در انتظار"}
                  </span>
                  <span className="text-lg font-bold text-[#286378]">
                    {new Intl.NumberFormat("fa-IR").format(order.totalAmount)} تومان
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Link href={`/orders/${order.id}`} className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium">تعداد آیتم:</span>{" "}
                    {order.items && Array.isArray(order.items) && order.items.length > 0
                      ? order.items.reduce((total, item) => total + (item.quantity || 0), 0)
                      : 0}
                  </p>
                </Link>
                {order.paymentStatus === "unpaid" && (
                  <Link
                    href={`/payment/${order.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#286378] to-[#43909A] text-white rounded-lg hover:from-[#43909A] hover:to-[#286378] transition-all shadow-md hover:shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="font-semibold">پرداخت</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

