import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector, useAuth } from "@/store/hooks";
import { fetchSession } from "@/store/slices/authSlice";
import { fetchCart, updateCartItem, removeFromCart } from "@/store/slices/cartSlice";
import { useToast } from "@/components/providers/ToastProvider";

export function useCart() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { items, total, isLoading, error } = useAppSelector((state) => state.cart);
  const { isAuthenticated, isInitialized, isLoading: authLoading } = useAuth();
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    if (!isInitialized && !authLoading) {
      dispatch(fetchSession());
    }
  }, [isInitialized, authLoading, dispatch]);

  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated) {
        dispatch(fetchCart());
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isInitialized, dispatch, router]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      await dispatch(updateCartItem({ itemId, quantity: newQuantity })).unwrap();
    } catch (error) {
      showToast(error || "خطا در به‌روزرسانی سبد خرید", "error");
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      showToast("محصول از سبد خرید حذف شد", "success");
    } catch (error) {
      showToast(error || "خطا در حذف از سبد خرید", "error");
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  return {
    items,
    total,
    isLoading,
    error,
    isInitialized,
    authLoading,
    isAuthenticated,
    updatingItems,
    handleUpdateQuantity,
    handleRemoveItem,
  };
}

