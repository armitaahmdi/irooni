import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAccess } from "@/lib/admin-client";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * Hook for managing admin reviews CRUD operations
 */
export function useAdminReviews() {
  const router = useRouter();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        includeUnapproved: "true",
      });
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (filterStatus !== "all") {
        params.append("status", filterStatus === "approved" ? "approved" : "pending");
      }

      const response = await fetch(`/api/admin/reviews?${params}`);
      if (!response.ok) {
        const errorData = await response.json();
        showToast(errorData.error || "خطا در دریافت نظرات", "error");
        setReviews([]);
        setTotalPages(1);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setReviews(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        showToast(data.error || "خطا در دریافت نظرات", "error");
        setReviews([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      showToast("خطا در دریافت نظرات", "error");
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, filterStatus, showToast]);

  useEffect(() => {
    if (isAuthorized) {
      fetchReviews();
    }
  }, [isAuthorized, currentPage, searchQuery, filterStatus, fetchReviews]);

  const handleApprove = useCallback(
    async (reviewId) => {
      try {
        const response = await fetch(`/api/admin/reviews/${reviewId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isApproved: true }),
        });
        const data = await response.json();
        if (data.success) {
          showToast("نظر با موفقیت تایید شد", "success");
          fetchReviews();
          return true;
        } else {
          showToast(data.error || "خطا در تایید نظر", "error");
          return false;
        }
      } catch (error) {
        console.error("Error approving review:", error);
        showToast("خطا در تایید نظر", "error");
        return false;
      }
    },
    [showToast, fetchReviews]
  );

  const handleReject = useCallback(
    async (reviewId) => {
      try {
        const response = await fetch(`/api/admin/reviews/${reviewId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isApproved: false }),
        });
        const data = await response.json();
        if (data.success) {
          showToast("نظر رد شد", "success");
          fetchReviews();
          return true;
        } else {
          showToast(data.error || "خطا در رد نظر", "error");
          return false;
        }
      } catch (error) {
        console.error("Error rejecting review:", error);
        showToast("خطا در رد نظر", "error");
        return false;
      }
    },
    [showToast, fetchReviews]
  );

  const handleDelete = useCallback(
    async (reviewId) => {
      try {
        const response = await fetch(`/api/admin/reviews/${reviewId}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          showToast("نظر با موفقیت حذف شد", "success");
          fetchReviews();
          return true;
        } else {
          showToast(data.error || "خطا در حذف نظر", "error");
          return false;
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        showToast("خطا در حذف نظر", "error");
        return false;
      }
    },
    [showToast, fetchReviews]
  );

  return {
    reviews,
    isLoading,
    isAuthorized,
    currentPage,
    setCurrentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    handleApprove,
    handleReject,
    handleDelete,
  };
}

