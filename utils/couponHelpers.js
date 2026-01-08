/**
 * Helper functions for coupon formatting
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
  }).format(date);
};

