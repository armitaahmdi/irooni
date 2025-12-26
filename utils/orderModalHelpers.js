/**
 * Helper functions for OrderDetailsModal
 */

export const getStatusLabel = (status) => {
  const statusMap = {
    pending: "در انتظار",
    processing: "در حال پردازش",
    shipped: "ارسال شده",
    delivered: "تحویل داده شده",
    cancelled: "لغو شده",
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status) => {
  const colorMap = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

export const getPaymentStatusLabel = (paymentStatus) => {
  const paymentMap = {
    unpaid: "پرداخت نشده",
    paid: "پرداخت شده",
    refunded: "بازگشت وجه",
  };
  return paymentMap[paymentStatus] || paymentStatus;
};

export const getPaymentStatusColor = (paymentStatus) => {
  const colorMap = {
    unpaid: "bg-red-100 text-red-800",
    paid: "bg-green-100 text-green-800",
    refunded: "bg-orange-100 text-orange-800",
  };
  return colorMap[paymentStatus] || "bg-gray-100 text-gray-800";
};

export const getPaymentMethodLabel = (paymentMethod) => {
  if (paymentMethod === "cash_on_delivery") return "پرداخت در محل";
  if (paymentMethod === "zarinpal") return "زرین‌پال";
  if (paymentMethod === "payping") return "پی‌پینگ";
  return paymentMethod || "-";
};

