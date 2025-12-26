import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAccess } from "@/lib/admin-client";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * Hook for managing contact messages CRUD operations
 */
export function useContactMessages() {
  const router = useRouter();
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRead, setFilterRead] = useState("all");
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

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      if (filterRead !== "all") {
        params.append("isRead", filterRead === "read" ? "true" : "false");
      }

      const response = await fetch(`/api/admin/contact-messages?${params}`);

      if (!response.ok) {
        setMessages([]);
        setTotalPages(1);
        return;
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setMessages(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setMessages([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, filterRead]);

  useEffect(() => {
    if (isAuthorized) {
      fetchMessages();
    }
  }, [isAuthorized, currentPage, searchQuery, filterRead, fetchMessages]);

  const markAsRead = useCallback(
    async (id) => {
      try {
        const response = await fetch("/api/admin/contact-messages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, isRead: true }),
        });

        const data = await response.json();

        if (data.success) {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
          );
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error marking as read:", error);
        return false;
      }
    },
    []
  );

  const handleDelete = useCallback(
    async (messageId) => {
      try {
        const response = await fetch(`/api/admin/contact-messages?id=${messageId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          showToast("پیام با موفقیت حذف شد", "success");
          fetchMessages();
          return true;
        } else {
          showToast(data.error || "خطا در حذف پیام", "error");
          return false;
        }
      } catch (error) {
        console.error("Error deleting message:", error);
        showToast("خطا در حذف پیام", "error");
        return false;
      }
    },
    [showToast, fetchMessages]
  );

  return {
    messages,
    isLoading,
    isAuthorized,
    searchQuery,
    setSearchQuery,
    filterRead,
    setFilterRead,
    currentPage,
    setCurrentPage,
    totalPages,
    markAsRead,
    handleDelete,
  };
}

