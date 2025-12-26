import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  CreditCard,
} from "lucide-react";

/**
 * Helper functions for order formatting and status
 */

export const formatPrice = (value) =>
  new Intl.NumberFormat("fa-IR").format(value) + " تومان";

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const getStatusBadge = (status, paymentStatus) => {
  const statusMap = {
    pending: {
      label: paymentStatus === "unpaid" ? "در انتظار پرداخت" : "در انتظار",
      color:
        paymentStatus === "unpaid"
          ? "bg-orange-100 text-orange-800"
          : "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    processing: {
      label: "در حال پردازش",
      color: "bg-blue-100 text-blue-800",
      icon: Package,
    },
    shipped: {
      label: "ارسال شده",
      color: "bg-purple-100 text-purple-800",
      icon: Truck,
    },
    delivered: {
      label: "تحویل داده شده",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle2,
    },
    cancelled: {
      label: "لغو شده",
      color: "bg-red-100 text-red-800",
      icon: XCircle,
    },
  };
  return (
    statusMap[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
      icon: Package,
    }
  );
};

export const getPaymentStatusBadge = (paymentStatus) => {
  const paymentMap = {
    unpaid: { label: "پرداخت نشده", color: "bg-red-100 text-red-800" },
    paid: { label: "پرداخت شده", color: "bg-green-100 text-green-800" },
    refunded: { label: "بازگشت وجه", color: "bg-orange-100 text-orange-800" },
  };
  return (
    paymentMap[paymentStatus] || {
      label: paymentStatus,
      color: "bg-gray-100 text-gray-800",
    }
  );
};

export const getPaymentMethodLabel = (paymentMethod) => {
  const methods = {
    cash_on_delivery: "پرداخت در محل",
    zarinpal: "زرین‌پال",
    payping: "پی‌پینگ",
  };
  return methods[paymentMethod] || paymentMethod || "-";
};

