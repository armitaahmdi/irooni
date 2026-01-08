import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAccess } from "@/lib/admin-client";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * Hook for managing coupons CRUD operations
 */
export function useCoupons() {
  const router = useRouter();
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState("all");

  const checkAuth = useCallback(async () => {
    try {
      const { isAdmin } = await checkAdminAccess();
      if (isAdmin) {
        setIsAuthorized(true);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (filterActive !== "all") {
        params.append("isActive", filterActive === "active" ? "true" : "false");
      }

      const response = await fetch(`/api/admin/coupons?${params}`);
      if (!response.ok) {
        const errorData = await response.json();
        showToast(errorData.error || "خطا در دریافت کدهای تخفیف", "error");
        setCoupons([]);
        setTotalPages(1);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setCoupons(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        showToast(data.error || "خطا در دریافت کدهای تخفیف", "error");
        setCoupons([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      showToast("خطا در دریافت کدهای تخفیف", "error");
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, filterActive, showToast]);

  useEffect(() => {
    if (isAuthorized) {
      fetchCoupons();
    }
  }, [isAuthorized, currentPage, searchQuery, filterActive, fetchCoupons]);

  const handleSave = useCallback(
    async (formData, editingCoupon) => {
      try {
        const payload = {
          ...formData,
          discountValue: parseInt(formData.discountValue),
          minPurchase: formData.minPurchase ? parseInt(formData.minPurchase) : null,
          maxDiscount: formData.maxDiscount ? parseInt(formData.maxDiscount) : null,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        };

        const url = `/api/admin/coupons`;
        const method = editingCoupon ? "PATCH" : "POST";

        if (editingCoupon) {
          payload.id = editingCoupon.id;
        }

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.success) {
          showToast(
            editingCoupon
              ? "کد تخفیف با موفقیت به‌روزرسانی شد"
              : "کد تخفیف با موفقیت ایجاد شد",
            "success"
          );
          fetchCoupons();
          return true;
        } else {
          showToast(data.error || "خطا در ذخیره کد تخفیف", "error");
          return false;
        }
      } catch (error) {
        console.error("Error saving coupon:", error);
        showToast("خطا در ذخیره کد تخفیف", "error");
        return false;
      }
    },
    [showToast, fetchCoupons]
  );

  const handleDelete = useCallback(
    async (couponId) => {
      try {
        const response = await fetch(`/api/admin/coupons?id=${couponId}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          showToast("کد تخفیف با موفقیت حذف شد", "success");
          fetchCoupons();
          return true;
        } else {
          showToast(data.error || "خطا در حذف کد تخفیف", "error");
          return false;
        }
      } catch (error) {
        console.error("Error deleting coupon:", error);
        showToast("خطا در حذف کد تخفیف", "error");
        return false;
      }
    },
    [showToast, fetchCoupons]
  );

  return {
    coupons,
    isLoading,
    isAuthorized,
    currentPage,
    setCurrentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    filterActive,
    setFilterActive,
    handleSave,
    handleDelete,
  };
}

