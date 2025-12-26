"use client";

import Link from "next/link";
import {
  Package,
  Clock,
  Loader2,
  Truck,
  CheckCircle2,
  RotateCcw,
  MapPin,
  Plus,
  Edit,
  Trash2,
  CreditCard,
  ExternalLink,
} from "lucide-react";

/**
 * DashboardSection Component
 * Dashboard overview with order stats and recent addresses
 */
export default function DashboardSection({
  orderStats,
  addresses,
  orders,
  onViewAllAddresses,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">داشبورد</h2>
        <p className="text-gray-600">خلاصه فعالیت‌ها و سفارش‌های شما</p>
      </div>

      {/* Order Stats Cards */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-[#286378]" />
          آمار سفارشات
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Pending Payment */}
          <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200/30 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">در انتظار پرداخت</p>
              <p className="text-3xl font-bold text-gray-900">{orderStats.pendingPayment}</p>
            </div>
          </div>

          {/* Processing */}
          <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg">
                  <Loader2 className="w-7 h-7 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">در حال پردازش</p>
              <p className="text-3xl font-bold text-gray-900">{orderStats.processing}</p>
            </div>
          </div>

          {/* Shipped */}
          <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-lg">
                  <Truck className="w-7 h-7 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">ارسال شده</p>
              <p className="text-3xl font-bold text-gray-900">{orderStats.shipped}</p>
            </div>
          </div>

          {/* Delivered */}
          <div className="group relative bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">تحویل شده</p>
              <p className="text-3xl font-bold text-gray-900">{orderStats.delivered}</p>
            </div>
          </div>

          {/* Refunded */}
          <div className="group relative bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-6 border-2 border-red-200 hover:border-red-400 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/30 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-lg">
                  <RotateCcw className="w-7 h-7 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">مرجوعی</p>
              <p className="text-3xl font-bold text-gray-900">{orderStats.refunded}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Addresses */}
      {addresses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#286378]" />
              آدرس‌های ثبت شده
            </h3>
            <button
              onClick={onViewAllAddresses}
              className="text-sm text-[#286378] hover:text-[#43909A] font-medium transition-colors"
            >
              مشاهده همه
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.slice(0, 2).map((address) => (
              <div
                key={address.id}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border-2 border-gray-200 hover:border-[#286378] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-gray-900">{address.title}</h4>
                      {address.isDefault && (
                        <span className="px-2 py-1 text-xs font-medium bg-[#286378] text-white rounded-full">
                          پیش‌فرض
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {address.province}، {address.city}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditAddress(address)}
                      className="p-2 text-[#286378] hover:bg-[#286378]/10 rounded-lg transition-colors"
                      title="ویرایش"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteAddress(address.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {orders && orders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-[#286378]" />
              آخرین سفارش‌ها
            </h3>
            <button
              onClick={() => {}}
              className="text-sm text-[#286378] hover:text-[#43909A] font-medium transition-colors"
            >
              مشاهده همه
            </button>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border-2 border-gray-200 hover:border-[#286378] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-900">سفارش #{order.id}</h4>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status === "delivered"
                          ? "تحویل شده"
                          : order.status === "shipped"
                          ? "ارسال شده"
                          : order.status === "processing"
                          ? "در حال پردازش"
                          : "در انتظار پرداخت"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt || order.created_at).toLocaleDateString("fa-IR")}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      {new Intl.NumberFormat("fa-IR").format(
                        order.total || order.items?.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0) || 0
                      )}{" "}
                      تومان
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="font-semibold">مشاهده</span>
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

