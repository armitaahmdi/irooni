import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/store/hooks";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * Hook for managing product reviews
 */
export function useProductReviews(productId) {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userVotes, setUserVotes] = useState({});

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/products/${productId}/reviews?page=${currentPage}&limit=5`
      );
      const data = await response.json();

      if (data.success) {
        setReviews(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        if (isAuthenticated) {
          fetchUserVotesForReviews(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [productId, currentPage, isAuthenticated]);

  const fetchUserVotesForReviews = useCallback(
    async (reviewsList) => {
      if (!isAuthenticated || reviewsList.length === 0) return;

      try {
        const votes = {};
        for (const review of reviewsList) {
          const response = await fetch(
            `/api/products/${productId}/reviews/${review.id}/helpful`
          );
          const data = await response.json();
          if (data.success) {
            votes[review.id] = data.data.userVote;
          }
        }
        setUserVotes(votes);
      } catch (error) {
        console.error("Error fetching user votes:", error);
      }
    },
    [productId, isAuthenticated]
  );

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews/stats`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [fetchReviews, fetchStats]);

  const handleHelpful = useCallback(
    async (reviewId, isHelpful) => {
      if (!isAuthenticated) {
        showToast("لطفاً ابتدا وارد شوید", "error");
        return;
      }

      try {
        const response = await fetch(
          `/api/products/${productId}/reviews/${reviewId}/helpful`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isHelpful }),
          }
        );

        const data = await response.json();

        if (data.success) {
          setUserVotes((prev) => ({
            ...prev,
            [reviewId]: data.data.userVote,
          }));
          fetchReviews();
        } else {
          showToast(data.error || "خطا در ثبت رای", "error");
        }
      } catch (error) {
        console.error("Error voting on review:", error);
        showToast("خطا در ثبت رای", "error");
      }
    },
    [productId, isAuthenticated, showToast, fetchReviews]
  );

  const handleSubmitReview = useCallback(
    async (reviewForm) => {
      if (!isAuthenticated) {
        showToast("لطفاً ابتدا وارد شوید", "error");
        return false;
      }

      if (reviewForm.rating === 0) {
        showToast("لطفاً امتیاز خود را انتخاب کنید", "error");
        return false;
      }

      try {
        const response = await fetch(`/api/products/${productId}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewForm),
        });

        const data = await response.json();

        if (data.success) {
          showToast("نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود", "success");
          fetchReviews();
          fetchStats();
          return true;
        } else {
          showToast(data.error || "خطا در ثبت نظر", "error");
          return false;
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        showToast("خطا در ثبت نظر", "error");
        return false;
      }
    },
    [productId, isAuthenticated, showToast, fetchReviews, fetchStats]
  );

  const handleReply = useCallback(
    async (reviewId, replyText) => {
      if (!isAuthenticated) {
        showToast("لطفاً ابتدا وارد شوید", "error");
        return false;
      }

      if (!replyText.trim()) {
        showToast("لطفاً متن پاسخ را وارد کنید", "error");
        return false;
      }

      try {
        const response = await fetch(`/api/products/${productId}/reviews/${reviewId}/reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reply: replyText }),
        });

        const data = await response.json();

        if (data.success) {
          showToast("پاسخ شما با موفقیت ثبت شد", "success");
          fetchReviews();
          return true;
        } else {
          showToast(data.error || "خطا در ثبت پاسخ", "error");
          return false;
        }
      } catch (error) {
        console.error("Error submitting reply:", error);
        showToast("خطا در ثبت پاسخ", "error");
        return false;
      }
    },
    [productId, isAuthenticated, showToast, fetchReviews]
  );

  return {
    reviews,
    stats,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    userVotes,
    handleHelpful,
    handleSubmitReview,
    handleReply,
    refetchReviews: fetchReviews,
    refetchStats: fetchStats,
  };
}

