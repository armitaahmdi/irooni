import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAccess } from "@/lib/admin-client";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * Hook for managing admin products CRUD operations
 */
export function useAdminProducts() {
  const router = useRouter();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (selectedCategory) {
        params.append("category", selectedCategory);
      }

      const response = await fetch(`/api/admin/products?${params}`);

      if (!response.ok) {
        setProducts([]);
        setTotalPages(1);
        return;
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory]);

  useEffect(() => {
    if (isAuthorized) {
      fetchProducts();
    }
  }, [isAuthorized, currentPage, searchQuery, selectedCategory, fetchProducts]);

  const handleDelete = useCallback(
    async (productId) => {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          showToast("محصول با موفقیت حذف شد", "success");
          fetchProducts();
          return true;
        } else {
          showToast(data.error || "خطا در حذف محصول", "error");
          return false;
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        showToast("خطا در حذف محصول", "error");
        return false;
      }
    },
    [showToast, fetchProducts]
  );

  return {
    products,
    isLoading,
    isAuthorized,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    totalPages,
    handleDelete,
  };
}

