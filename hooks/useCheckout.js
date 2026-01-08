import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCart } from "@/store/slices/cartSlice";
import { createOrder } from "@/store/slices/ordersSlice";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * Hook for managing checkout state and logic
 */
export function useCheckout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { items, total, isLoading: cartLoading } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { isLoading: orderLoading } = useAppSelector((state) => state.orders);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("zarinpal");
  const [notes, setNotes] = useState("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [shippingCost] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const hasFetchedAddresses = useRef(false);

  const fetchAddresses = useCallback(async () => {
    if (hasFetchedAddresses.current) return;

    setIsLoadingAddresses(true);
    try {
      const response = await fetch("/api/addresses");
      const data = await response.json();

      if (data.success) {
        setAddresses(data.data || []);
        const defaultAddress = data.data?.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (data.data?.length > 0) {
          setSelectedAddressId(data.data[0].id);
        }
        hasFetchedAddresses.current = true;
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (items.length === 0 && !cartLoading) {
      router.push("/cart");
      return;
    }

    dispatch(fetchCart());

    if (!hasFetchedAddresses.current) {
      fetchAddresses();
    }
  }, [isAuthenticated, router, dispatch, fetchAddresses, items.length, cartLoading]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showToast("لطفاً کد تخفیف را وارد کنید", "error");
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          totalAmount: total,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppliedCoupon(data.data);
        showToast("کد تخفیف با موفقیت اعمال شد", "success");
      } else {
        showToast(data.error || "کد تخفیف معتبر نیست", "error");
        setAppliedCoupon(null);
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      showToast("خطا در اعتبارسنجی کد تخفیف", "error");
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAddressId) {
      showToast("لطفاً آدرس ارسال را انتخاب کنید", "error");
      return;
    }

    try {
      const result = await dispatch(
        createOrder({
          addressId: selectedAddressId,
          paymentMethod,
          notes: notes.trim() || null,
          shippingCost,
          couponId: appliedCoupon?.couponId || null,
        })
      ).unwrap();

      if (result.success) {
        router.push(`/payment/${result.data.id}`);
      }
    } catch (error) {
      showToast(error?.message || error || "خطا در ثبت سفارش", "error");
    }
  };

  const discountAmount = appliedCoupon?.discountAmount || 0;
  const finalTotal = Math.max(0, total + shippingCost - discountAmount);

  return {
    items,
    total,
    cartLoading,
    isAuthenticated,
    orderLoading,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    paymentMethod,
    setPaymentMethod,
    notes,
    setNotes,
    isLoadingAddresses,
    couponCode,
    setCouponCode,
    appliedCoupon,
    isValidatingCoupon,
    discountAmount,
    finalTotal,
    shippingCost,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleSubmit,
  };
}

