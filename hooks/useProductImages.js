import { useState, useCallback } from "react";

/**
 * Hook for managing product images
 */
export function useProductImages(formData, setFormData, showToast) {
  const [newImage, setNewImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const addImage = useCallback(() => {
    if (newImage.trim()) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), newImage.trim()],
      });
      setNewImage("");
    }
  }, [newImage, formData, setFormData]);

  const removeImage = useCallback(
    (index) => {
      setFormData({
        ...formData,
        images: (formData.images || []).filter((_, i) => i !== index),
      });
    },
    [formData, setFormData]
  );

  const handleImageUpload = useCallback(
    async (e, isMainImage = false) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        if (isMainImage) {
          setUploadingImage(true);
        } else {
          setUploadingImages(true);
        }

        const formDataObj = new FormData();
        formDataObj.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataObj,
        });

        const data = await response.json();

        if (data.success) {
          if (isMainImage) {
            setFormData({ ...formData, image: data.url });
          } else {
            setFormData({
              ...formData,
              images: [...(formData.images || []), data.url],
            });
          }
        } else {
          showToast(data.error || "خطا در آپلود عکس", "error");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        showToast("خطا در آپلود عکس", "error");
      } finally {
        if (isMainImage) {
          setUploadingImage(false);
        } else {
          setUploadingImages(false);
        }
        e.target.value = "";
      }
    },
    [formData, setFormData, showToast]
  );

  return {
    newImage,
    setNewImage,
    uploadingImage,
    uploadingImages,
    addImage,
    removeImage,
    handleImageUpload,
  };
}

