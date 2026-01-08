import { useState, useEffect, useCallback } from "react";
import { safeJsonParse } from "@/utils/api";

/**
 * Hook for managing reviews
 */
export function useReviews(showToast, activeSection, isAuthenticated) {
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsTotalPages, setReviewsTotalPages] = useState(1);

  const fetchReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    try {
      const response = await fetch(`/api/profile/reviews?page=${reviewsPage}&limit=10`);

      if (!response.ok) {
        const errorData = await safeJsonParse(response).catch(() => ({}));
        showToast(errorData.error || "خطا در دریافت نظرات", "error");
        setReviews([]);
        return;
      }

      const data = await safeJsonParse(response);

      if (data.success) {
        setReviews(data.data || []);
        setReviewsTotalPages(data.pagination?.totalPages || 1);
      } else {
        setReviews([]);
        if (data.error) {
          showToast(data.error || "خطا در دریافت نظرات", "error");
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      if (error.name !== "TypeError") {
        showToast("خطا در دریافت نظرات", "error");
      }
    } finally {
      setIsLoadingReviews(false);
    }
  }, [reviewsPage, showToast]);

  useEffect(() => {
    if ((activeSection === "reviews" || activeSection === "dashboard") && isAuthenticated) {
      fetchReviews();
    }
  }, [activeSection, isAuthenticated, reviewsPage, fetchReviews]);

  return {
    reviews,
    isLoadingReviews,
    reviewsPage,
    reviewsTotalPages,
    setReviewsPage,
  };
}

