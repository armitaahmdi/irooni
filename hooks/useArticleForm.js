import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { checkAdminAccess } from "@/lib/admin-client";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * Generate slug from text
 */
const generateSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

/**
 * Hook for managing article form (edit mode)
 */
export function useArticleForm() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [articleId, setArticleId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    image: "",
    content: "",
    excerpt: "",
    category: "",
    isPublished: false,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

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
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthorized && params) {
      const id = params.id instanceof Promise ? null : params.id;
      if (id) {
        setArticleId(id);
        fetchArticle(id);
      }
    }
  }, [isAuthorized, params]);

  const fetchArticle = useCallback(async (id) => {
    try {
      setIsFetching(true);
      const response = await fetch(`/api/admin/articles/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          showToast("مقاله یافت نشد", "error");
          router.push("/admin/articles");
          return;
        }
        throw new Error("خطا در دریافت مقاله");
      }

      const data = await response.json();

      if (data.success && data.data) {
        setFormData({
          title: data.data.title || "",
          slug: data.data.slug || "",
          image: data.data.image || "",
          content: data.data.content || "",
          excerpt: data.data.excerpt || "",
          category: data.data.category || "",
          isPublished: data.data.isPublished || false,
        });
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      showToast("خطا در دریافت مقاله", "error");
      router.push("/admin/articles");
    } finally {
      setIsFetching(false);
    }
  }, [router, showToast]);

  const handleTitleChange = useCallback((value) => {
    setFormData((prev) => {
      const newData = { ...prev, title: value };
      if (!prev.slug) {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
  }, []);

  const handleImageUpload = useCallback(async (file) => {
    try {
      setUploadingImage(true);
      const formDataToUpload = new FormData();
      formDataToUpload.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToUpload,
      });

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        showToast("تصویر با موفقیت آپلود شد", "success");
        return data.url;
      } else {
        showToast(data.error || "خطا در آپلود عکس", "error");
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("خطا در آپلود عکس", "error");
      return null;
    } finally {
      setUploadingImage(false);
    }
  }, [showToast]);

  const handleSubmit = useCallback(async () => {
    if (!formData.slug || formData.slug.trim() === "") {
      showToast("لطفاً اسلاگ را وارد کنید", "error");
      return false;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: formData.title || null,
        slug: formData.slug.trim(),
        image: formData.image || null,
        content: formData.content || null,
        excerpt: formData.excerpt || null,
        category: formData.category || null,
        isPublished: formData.isPublished || false,
      };

      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        showToast("مقاله با موفقیت به‌روزرسانی شد", "success");
        setTimeout(() => {
          router.push("/admin/articles");
        }, 1000);
        return true;
      } else {
        showToast(data.error || "خطا در به‌روزرسانی مقاله", "error");
        return false;
      }
    } catch (error) {
      console.error("Error updating article:", error);
      showToast("خطا در به‌روزرسانی مقاله", "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [formData, articleId, router, showToast]);

  return {
    formData,
    setFormData,
    isLoading,
    isAuthorized,
    isFetching,
    uploadingImage,
    handleTitleChange,
    handleImageUpload,
    handleSubmit,
  };
}

