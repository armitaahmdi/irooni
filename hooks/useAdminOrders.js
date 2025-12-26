import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAccess } from "@/lib/admin-client";
import { adminOrdersApi } from "@/lib/api/client";

export function useAdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, order: null });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchOrders();
    }
  }, [isAuthorized, currentPage, searchQuery, selectedStatus]);

  const checkAuth = async () => {
    try {
      const isAdmin = await checkAdminAccess();
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

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const params = { page: currentPage.toString(), limit: "20" };
      if (searchQuery) params.search = searchQuery;
      if (selectedStatus) params.status = selectedStatus;

      const data = await adminOrdersApi.getOrders(params);
      if (data.success) {
        setOrders(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    orders,
    isLoading,
    isAuthorized,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    detailsModal,
    setDetailsModal,
    fetchOrders,
  };
}

