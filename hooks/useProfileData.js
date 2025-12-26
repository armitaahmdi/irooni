import { useMemo } from "react";

/**
 * Hook for profile page data calculations
 */
export function useOrderStats(orders) {
  return useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        pendingPayment: 0,
        delivered: 0,
        processing: 0,
        shipped: 0,
        refunded: 0,
      };
    }

    let pendingPayment = 0;
    let delivered = 0;
    let processing = 0;
    let shipped = 0;
    let refunded = 0;

    orders.forEach((order) => {
      if (
        order.paymentStatus === "refunded" ||
        order.status === "cancelled"
      ) {
        refunded++;
      } else if (order.status === "delivered") {
        delivered++;
      } else if (order.status === "shipped") {
        shipped++;
      } else if (order.paymentStatus === "unpaid") {
        pendingPayment++;
      } else if (
        order.paymentStatus === "paid" &&
        order.status === "processing"
      ) {
        processing++;
      }
    });

    return {
      pendingPayment,
      delivered,
      processing,
      shipped,
      refunded,
    };
  }, [orders]);
}

export function useFilteredOrders(orders, orderFilter) {
  return useMemo(() => {
    if (!orderFilter) return orders;

    return orders.filter((order) => {
      switch (orderFilter) {
        case "pendingPayment":
          return order.paymentStatus === "unpaid";
        case "processing":
          return (
            order.paymentStatus === "paid" &&
            order.status === "processing"
          );
        case "shipped":
          return order.status === "shipped";
        case "delivered":
          return order.status === "delivered";
        case "refunded":
          return (
            order.paymentStatus === "refunded" ||
            order.status === "cancelled"
          );
        default:
          return true;
      }
    });
  }, [orders, orderFilter]);
}

