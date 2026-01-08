import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSession } from "@/store/slices/authSlice";
import { useToast } from "@/components/providers/ToastProvider";

export function usePayment() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { isAuthenticated, isLoading: authLoading, isInitialized } = useAppSelector(
    (state) => state.auth
  );
  const orderId = params?.orderId;
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchSession());
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    if (isInitialized && !authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && orderId) {
      fetchOrder();
    }
  }, [orderId, isAuthenticated, authLoading, isInitialized, router]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();

      if (data.success && data.data) {
        if (data.data.paymentStatus === "paid") {
          showToast("این سفارش قبلاً پرداخت شده است", "info");
          router.push(`/orders/${orderId}`);
          return;
        }
        setOrder(data.data);
      } else {
        showToast("سفارش یافت نشد", "error");
        router.push("/orders");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      showToast("خطا در دریافت اطلاعات سفارش", "error");
      router.push("/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!order) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/payment/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          paymentMethod: order.paymentMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast("پرداخت با موفقیت انجام شد", "success");
        router.push(`/orders/${orderId}`);
      } else {
        showToast(data.error || "خطا در پرداخت", "error");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      showToast("خطا در پرداخت", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    order,
    isLoading,
    isProcessing,
    isInitialized,
    authLoading,
    isAuthenticated,
    handlePayment,
  };
}

