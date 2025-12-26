import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { checkAdminAccess } from "@/lib/admin-client";
import { useToast } from "@/components/providers/ToastProvider";

const INITIAL_FORM_DATA = {
  name: "",
  code: "",
  category: "",
  subcategory: "",
  image: "",
  images: [],
  price: "",
  discountPercent: "",
  stock: "",
  sizeStock: {},
  variants: [],
  sizes: [],
  colors: [],
  inStock: true,
  isVisible: true,
  material: "",
  description: "",
  features: [],
  sizeChart: [],
};

/**
 * Hook for managing product form state and operations
 */
export function useProductForm(productId, isEdit = false) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

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

  const fetchProduct = useCallback(async () => {
    if (!isEdit || !productId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/products/${productId}`);
      const data = await response.json();

      if (data.success) {
        const product = data.data;
        let discountPercent = "";
        if (product.originalPrice && product.price) {
          const discount = Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) * 100
          );
          discountPercent = discount > 0 ? discount.toString() : "";
        } else if (product.discountPercent) {
          discountPercent = product.discountPercent.toString();
        }

        setFormData({
          name: product.name || "",
          code: product.code || "",
          category: product.category || "",
          subcategory: product.subcategory || "",
          image: product.image || "",
          images: product.images || [],
          price: product.price?.toString() || "",
          discountPercent: discountPercent,
          stock: product.stock?.toString() || "0",
          sizeStock: product.sizeStock || {},
          variants:
            product.variants?.map((v) => ({
              id: v.id,
              color: v.color,
              size: v.size,
              price: v.price,
              stock: v.stock,
              image: v.image,
            })) || [],
          sizes: product.sizes || [],
          colors: product.colors || [],
          inStock: product.inStock ?? true,
          isVisible: product.isVisible ?? true,
          material: product.material || "",
          description: product.description || "",
          features: product.features || [],
          sizeChart: product.sizeChart || [],
        });
      } else {
        showToast("محصول یافت نشد", "error");
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      showToast("خطا در دریافت محصول", "error");
      router.push("/admin/products");
    } finally {
      setIsLoading(false);
    }
  }, [isEdit, productId, showToast, router]);

  useEffect(() => {
    if (isAuthorized && isEdit && productId) {
      fetchProduct();
    } else if (isAuthorized && !isEdit) {
      setIsLoading(false);
    }
  }, [isAuthorized, isEdit, productId, fetchProduct]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSaving(true);

      try {
        const payload = {
          ...formData,
          price: parseInt(formData.price),
          discountPercent: formData.discountPercent ? parseInt(formData.discountPercent) : null,
          stock: parseInt(formData.stock) || 0,
          sizeStock: formData.sizeStock || {},
          variants: (formData.variants || []).map((v) => ({
            id: v.id,
            color: v.color,
            size: v.size,
            price: v.price || parseInt(formData.price),
            stock: v.stock || 0,
            image: v.image || null,
          })),
          subcategory: formData.subcategory || null,
          material: formData.material || null,
          description: formData.description || null,
          sizeChart: (formData.sizeChart || []).length > 0 ? formData.sizeChart : null,
        };

        const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";
        const method = isEdit ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.success) {
          showToast(
            isEdit ? "محصول با موفقیت به‌روزرسانی شد" : "محصول با موفقیت ایجاد شد",
            "success"
          );
          setTimeout(() => {
            router.push("/admin/products");
          }, 1000);
        } else {
          showToast(data.error || `خطا در ${isEdit ? "به‌روزرسانی" : "ایجاد"} محصول`, "error");
        }
      } catch (error) {
        console.error(`Error ${isEdit ? "updating" : "creating"} product:`, error);
        showToast(`خطا در ${isEdit ? "به‌روزرسانی" : "ایجاد"} محصول`, "error");
      } finally {
        setIsSaving(false);
      }
    },
    [formData, isEdit, productId, showToast, router]
  );

  return {
    formData,
    setFormData,
    isLoading,
    isSaving,
    isAuthorized,
    handleSubmit,
  };
}

