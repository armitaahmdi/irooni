import { useState, useEffect } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { adminOrdersApi } from "@/lib/api/client";

/**
 * Hook for managing order details modal
 */
export function useOrderDetailsModal(order, isOpen, onClose, onUpdate) {
  const { showToast } = useToast();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    paymentStatus: "",
    trackingNumber: "",
    adminNotes: "",
  });

  useEffect(() => {
    if (isOpen && order) {
      fetchOrderDetails();
      setFormData({
        status: order.status || "",
        paymentStatus: order.paymentStatus || "",
        trackingNumber: order.trackingNumber || "",
        adminNotes: order.adminNotes || "",
      });
    }
  }, [isOpen, order]);

  const fetchOrderDetails = async () => {
    if (!order?.id) return;

    setIsLoading(true);
    try {
      const data = await adminOrdersApi.getOrder(order.id);

      if (data.success) {
        setOrderDetails(data.data);
        setFormData({
          status: data.data.status || "",
          paymentStatus: data.data.paymentStatus || "",
          trackingNumber: data.data.trackingNumber || "",
          adminNotes: data.data.adminNotes || "",
        });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!order?.id) return;

    setIsSaving(true);
    try {
      const data = await adminOrdersApi.updateOrder(order.id, formData);

      if (data.success) {
        showToast("وضعیت سفارش به‌روزرسانی شد", "success");
        if (onUpdate) {
          onUpdate();
        }
        onClose();
      }
    } catch (error) {
      showToast(error || "خطا در به‌روزرسانی سفارش", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    orderDetails,
    isLoading,
    isSaving,
    formData,
    setFormData,
    handleSave,
  };
}

