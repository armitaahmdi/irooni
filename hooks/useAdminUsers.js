import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAccess } from "@/lib/admin-client";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * Hook for managing admin users CRUD operations
 */
export function useAdminUsers() {
  const router = useRouter();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

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

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (selectedRole) {
        params.append("role", selectedRole);
      }

      const response = await fetch(`/api/admin/users?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "خطا در ارتباط با سرور" }));
        showToast(errorData.error || "خطا در دریافت کاربران", "error");
        return;
      }

      const data = await response.json();

      if (data.success) {
        setUsers(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        showToast(data.error || "خطا در دریافت کاربران", "error");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast("خطا در دریافت کاربران", "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, selectedRole, showToast]);

  useEffect(() => {
    if (isAuthorized) {
      fetchUsers();
    }
  }, [isAuthorized, currentPage, searchQuery, selectedRole, fetchUsers]);

  const handleDelete = useCallback(
    async (userId) => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          showToast("کاربر با موفقیت حذف شد", "success");
          fetchUsers();
          return true;
        } else {
          showToast(data.error || "خطا در حذف کاربر", "error");
          return false;
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        showToast("خطا در حذف کاربر", "error");
        return false;
      }
    },
    [showToast, fetchUsers]
  );

  const handleUpdate = useCallback(
    async (userId, userData) => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            role: userData.role,
          }),
        });

        const data = await response.json();

        if (data.success) {
          showToast("کاربر با موفقیت به‌روزرسانی شد", "success");
          fetchUsers();
          return true;
        } else {
          showToast(data.error || "خطا در به‌روزرسانی کاربر", "error");
          return false;
        }
      } catch (error) {
        console.error("Error updating user:", error);
        showToast("خطا در به‌روزرسانی کاربر", "error");
        return false;
      }
    },
    [showToast, fetchUsers]
  );

  return {
    users,
    isLoading,
    isAuthorized,
    currentPage,
    setCurrentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    handleDelete,
    handleUpdate,
  };
}

