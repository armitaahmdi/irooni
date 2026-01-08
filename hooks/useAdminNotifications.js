import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook for managing admin notifications
 */
export function useAdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastChecked, setLastChecked] = useState(null);
  const lastCheckedRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchNotifications = useCallback(async (isInitial = false) => {
    try {
      const currentLastChecked = lastCheckedRef.current;
      const url =
        isInitial || !currentLastChecked
          ? "/api/admin/notifications"
          : `/api/admin/notifications?lastChecked=${encodeURIComponent(currentLastChecked)}`;

      const response = await fetch(url);

      if (response.status === 403 || response.status === 401) {
        console.warn("Access denied to notifications. Stopping polling.");
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      if (!response.ok) {
        console.error("Error fetching notifications:", response.status, response.statusText);
        return;
      }

      const data = await response.json();

      if (data.success) {
        const orders = data.data.orders || [];
        if (isInitial || !currentLastChecked) {
          const uniqueOrders = Array.from(
            new Map(orders.map((order) => [order.orderNumber, order])).values()
          );
          setNotifications(uniqueOrders.slice(0, 20));
          setUnreadCount(data.data.count);
        } else {
          if (orders.length > 0) {
            setNotifications((prev) => {
              const combined = [...orders, ...prev];
              const unique = Array.from(
                new Map(combined.map((order) => [order.orderNumber, order])).values()
              );
              return unique.slice(0, 20);
            });
            setUnreadCount((prev) => prev + orders.length);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  const markAsRead = useCallback(async () => {
    try {
      const now = new Date().toISOString();
      await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lastChecked: now }),
      });
      setLastChecked(now);
      lastCheckedRef.current = now;
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  }, []);

  useEffect(() => {
    const initialLastChecked = new Date().toISOString();
    setLastChecked(initialLastChecked);
    lastCheckedRef.current = initialLastChecked;
    fetchNotifications(true);

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        fetchNotifications(false);
      }, 30000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchNotifications]);

  return {
    notifications,
    setNotifications,
    unreadCount,
    markAsRead,
  };
}

