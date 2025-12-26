import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/ToastProvider";
import { checkAdminAccess } from "@/lib/admin-client";

/**
 * Hook for managing admin articles
 */
export function useAdminArticles() {
  const router = useRouter();
  const { showToast } = useToast();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    articleId: null,
    articleTitle: "",
    isLoading: false,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchArticles();
    }
  }, [isAuthorized, currentPage, searchQuery]);

  const checkAuth = async () => {
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
  };

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`/api/admin/articles?${params}`);

      if (!response.ok) {
        console.error("API response not OK:", response.status, response.statusText);
        setArticles([]);
        setTotalPages(1);
        return;
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setArticles(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setArticles([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.articleId) return;

    try {
      setDeleteModal((prev) => ({ ...prev, isLoading: true }));

      const response = await fetch(`/api/admin/articles/${deleteModal.articleId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        showToast("مقاله با موفقیت حذف شد", "success");
        setDeleteModal({ isOpen: false, articleId: null, articleTitle: "", isLoading: false });
        fetchArticles();
      } else {
        showToast(data.error || "خطا در حذف مقاله", "error");
        setDeleteModal((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      showToast("خطا در حذف مقاله", "error");
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const openDeleteModal = (articleId, articleTitle) => {
    setDeleteModal({
      isOpen: true,
      articleId,
      articleTitle: articleTitle || "این مقاله",
      isLoading: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, articleId: null, articleTitle: "", isLoading: false });
  };

  return {
    articles,
    isLoading,
    isAuthorized,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  };
}

