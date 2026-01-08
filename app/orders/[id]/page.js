"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Package } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOrder } from "@/store/slices/ordersSlice";
import { fetchSession } from "@/store/slices/authSlice";
import OrderHeader from "@/components/orders/OrderHeader";
import OrderProgressStepper from "@/components/orders/OrderProgressStepper";
import OrderItemsList from "@/components/orders/OrderItemsList";
import OrderAddress from "@/components/orders/OrderAddress";
import OrderNotes from "@/components/orders/OrderNotes";
import OrderSummary from "@/components/orders/OrderSummary";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentOrder, isLoading } = useAppSelector((state) => state.orders);
  const { isAuthenticated, isLoading: authLoading, isInitialized } = useAppSelector(
    (state) => state.auth
  );

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

    if (isAuthenticated && params.id) {
      dispatch(fetchOrder(params.id));
    }
  }, [params.id, isAuthenticated, authLoading, isInitialized, router, dispatch]);

  if (!isInitialized || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#286378] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بررسی...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#286378] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری سفارش...</p>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">سفارش یافت نشد</h2>
            <Link
              href="/profile?section=orders"
              className="inline-flex items-center gap-2 text-[#286378] hover:text-[#43909A] font-semibold"
            >
              بازگشت به سفارش‌ها
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OrderHeader order={currentOrder} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentOrder.status !== "cancelled" && (
              <OrderProgressStepper
                status={currentOrder.status}
                paymentStatus={currentOrder.paymentStatus}
              />
            )}

            <OrderItemsList
              items={currentOrder.items}
              totalAmount={currentOrder.totalAmount}
              shippingCost={currentOrder.shippingCost}
            />

            <OrderAddress address={currentOrder.address} />

            <OrderNotes notes={currentOrder.notes} adminNotes={currentOrder.adminNotes} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <OrderSummary order={currentOrder} />
          </div>
        </div>
      </div>
    </div>
  );
}
