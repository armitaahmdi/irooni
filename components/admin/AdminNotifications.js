"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/utils/orderHelpers";
import { formatDate } from "@/utils/reviewHelpers";

/**
 * Format date relative to now
 */
const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "همین الان";
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  if (hours < 24) return `${hours} ساعت پیش`;
  if (days < 7) return `${days} روز پیش`;

  return formatDate(dateString);
};

/**
 * Get status badge
 */
const getStatusBadge = (status) => {
  const statusMap = {
    pending: { label: "در انتظار", color: "bg-yellow-100 text-yellow-800" },
    processing: { label: "در حال پردازش", color: "bg-blue-100 text-blue-800" },
    shipped: { label: "ارسال شده", color: "bg-purple-100 text-purple-800" },
    delivered: { label: "تحویل داده شده", color: "bg-green-100 text-green-800" },
    cancelled: { label: "لغو شده", color: "bg-red-100 text-red-800" },
  };
  return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" };
};

/**
 * Get payment status badge
 */
const getPaymentStatusBadge = (status) => {
  const statusMap = {
    unpaid: { label: "پرداخت نشده", color: "bg-red-100 text-red-800" },
    paid: { label: "پرداخت شده", color: "bg-green-100 text-green-800" },
    refunded: { label: "بازگشت وجه", color: "bg-orange-100 text-orange-800" },
  };
  return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" };
};

/**
 * AdminNotifications Component
 * Notification dropdown for admin panel
 */
export default function AdminNotifications({
  notifications,
  setNotifications,
  unreadCount,
  onMarkAsRead,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (unreadCount > 0 && !isOpen) {
      onMarkAsRead();
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-[500px] bg-white rounded-lg shadow-xl border border-gray-200 max-h-[600px] overflow-y-auto z-50">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">نوتیفیکیشن‌ها</h3>
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  setNotifications([]);
                  onMarkAsRead();
                }}
                className="text-sm text-[#286378] hover:text-[#43909A]"
              >
                پاک کردن همه
              </button>
            )}
          </div>
          <div className="divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>نوتیفیکیشنی وجود ندارد</p>
              </div>
            ) : (
              notifications.map((notification, index) => {
                const statusBadge = getStatusBadge(notification.status);
                const paymentBadge = getPaymentStatusBadge(notification.paymentStatus);
                const uniqueKey = `${notification.orderNumber}-${notification.id || index}`;
                return (
                  <Link
                    key={uniqueKey}
                    href={`/admin/orders?order=${notification.orderNumber}`}
                    onClick={() => setIsOpen(false)}
                    className="block p-4 hover:bg-gray-50 transition-colors border-r-4 border-transparent hover:border-[#286378]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#286378]/10 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-[#286378]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            سفارش #{notification.orderNumber}
                          </p>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusBadge.color}`}
                          >
                            {statusBadge.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${paymentBadge.color}`}
                          >
                            {paymentBadge.label}
                          </span>
                          <span className="text-xs font-semibold text-[#286378]">
                            {formatPrice(notification.totalAmount)}
                          </span>
                        </div>
                        {notification.user?.name && (
                          <p className="text-xs text-gray-600 mb-1">{notification.user.name}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatRelativeDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <Link
                href="/admin/orders"
                onClick={() => setIsOpen(false)}
                className="text-sm text-[#286378] hover:text-[#43909A] font-medium"
              >
                مشاهده همه سفارشات
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

