import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAccess } from "@/lib/admin-client";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * Hook for managing slides CRUD operations
 */
export function useSlides() {
  const router = useRouter();
  const { showToast } = useToast();
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

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

  const fetchSlides = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/slides");
      const data = await response.json();

      if (data.success) {
        setSlides(data.data);
      } else {
        showToast("خطا در دریافت بنرها", "error");
        setSlides([]);
      }
    } catch (error) {
      console.error("Error fetching slides:", error);
      showToast("خطا در دریافت بنرها", "error");
      setSlides([]);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (isAuthorized) {
      fetchSlides();
    }
  }, [isAuthorized, fetchSlides]);

  const handleToggleActive = useCallback(
    async (slide) => {
      try {
        const response = await fetch(`/api/admin/slides/${slide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...slide,
            isActive: !slide.isActive,
          }),
        });

        const data = await response.json();

        if (data.success) {
          showToast(slide.isActive ? "بنر غیرفعال شد" : "بنر فعال شد", "success");
          fetchSlides();
        } else {
          showToast("خطا در تغییر وضعیت بنر", "error");
        }
      } catch (error) {
        console.error("Error toggling slide:", error);
        showToast("خطا در تغییر وضعیت بنر", "error");
      }
    },
    [showToast, fetchSlides]
  );

  const handleOrderChange = useCallback(
    async (slide, direction, slides) => {
      const currentIndex = slides.findIndex((s) => s.id === slide.id);
      if (currentIndex === -1) return;

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= slides.length) return;

      const newOrder = slides[newIndex].order;
      const oldOrder = slide.order;

      try {
        await Promise.all([
          fetch(`/api/admin/slides/${slide.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...slide, order: newOrder }),
          }),
          fetch(`/api/admin/slides/${slides[newIndex].id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...slides[newIndex], order: oldOrder }),
          }),
        ]);

        fetchSlides();
      } catch (error) {
        console.error("Error changing order:", error);
        showToast("خطا در تغییر ترتیب", "error");
      }
    },
    [showToast, fetchSlides]
  );

  const handleDelete = useCallback(
    async (slideId) => {
      try {
        const response = await fetch(`/api/admin/slides/${slideId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          showToast("بنر با موفقیت حذف شد", "success");
          fetchSlides();
          return true;
        } else {
          showToast(data.error || "خطا در حذف بنر", "error");
          return false;
        }
      } catch (error) {
        console.error("Error deleting slide:", error);
        showToast("خطا در حذف بنر", "error");
        return false;
      }
    },
    [showToast, fetchSlides]
  );

  const handleSave = useCallback(
    async (formData, editingSlide) => {
      if (!formData.image || !formData.imageMobile || !formData.alt) {
        showToast("لطفاً تمام فیلدهای الزامی را پر کنید", "error");
        return false;
      }

      try {
        const url = editingSlide
          ? `/api/admin/slides/${editingSlide.id}`
          : "/api/admin/slides";
        const method = editingSlide ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          showToast(
            editingSlide ? "بنر با موفقیت به‌روزرسانی شد" : "بنر با موفقیت ایجاد شد",
            "success"
          );
          fetchSlides();
          return true;
        } else {
          showToast(data.error || "خطا در ذخیره بنر", "error");
          return false;
        }
      } catch (error) {
        console.error("Error saving slide:", error);
        showToast("خطا در ذخیره بنر", "error");
        return false;
      }
    },
    [showToast, fetchSlides]
  );

  return {
    slides,
    isLoading,
    isAuthorized,
    fetchSlides,
    handleToggleActive,
    handleOrderChange,
    handleDelete,
    handleSave,
  };
}

