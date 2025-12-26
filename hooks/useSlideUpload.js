import { useState, useCallback } from "react";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * Hook for managing slide image uploads
 */
export function useSlideUpload(showToast) {
  const [uploading, setUploading] = useState({
    image: false,
    imageMobile: false,
  });

  const handleFileUpload = useCallback(
    async (file, type, onSuccess) => {
      if (!file) return;

      // بررسی نوع فایل
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        showToast("نوع فایل مجاز نیست. فقط تصاویر JPEG, PNG, WebP مجاز است", "error");
        return;
      }

      // بررسی حجم فایل (حداکثر 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showToast("حجم فایل بیش از 5 مگابایت است", "error");
        return;
      }

      try {
        setUploading((prev) => ({ ...prev, [type]: true }));

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "banners");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          if (onSuccess) {
            onSuccess(data.url);
          }
          showToast("تصویر با موفقیت آپلود شد", "success");
        } else {
          showToast(data.error || "خطا در آپلود تصویر", "error");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        showToast("خطا در آپلود تصویر", "error");
      } finally {
        setUploading((prev) => ({ ...prev, [type]: false }));
      }
    },
    [showToast]
  );

  return {
    uploading,
    handleFileUpload,
  };
}

