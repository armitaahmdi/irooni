import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAccess } from "@/lib/admin-client";
import { useToast } from "@/components/providers/ToastProvider";

const generateSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export function useArticleFormNew() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
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

  useEffect(() => {
    checkAuth();
  }, []);

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

  const handleTitleChange = useCallback((value) => {
    setFormData((prev) => {
      const newData = { ...prev, title: value };
      if (!prev.slug || prev.slug === generateSlug(prev.title)) {
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

      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        showToast("مقاله با موفقیت ایجاد شد", "success");
        setTimeout(() => {
          router.push("/admin/articles");
        }, 1000);
        return true;
      } else {
        showToast(data.error || "خطا در ایجاد مقاله", "error");
        return false;
      }
    } catch (error) {
      console.error("Error creating article:", error);
      showToast("خطا در ایجاد مقاله", "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [formData, router, showToast]);

  return {
    formData,
    setFormData,
    isLoading,
    isAuthorized,
    uploadingImage,
    handleTitleChange,
    handleImageUpload,
    handleSubmit,
  };
}

