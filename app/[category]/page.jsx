"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductsPage from "@/components/ProductsPage";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [categorySlug, setCategorySlug] = useState(null);

  useEffect(() => {
    const validateCategory = async () => {
      const resolvedParams = params instanceof Promise ? await params : params;
      const category = resolvedParams?.category;

      if (!category) {
        router.replace("/404");
        return;
      }

      try {
        // بررسی سریع category - بدون blocking
        const response = await fetch(`/api/categories/${category}`);
        
        if (!response.ok && response.status === 404) {
          // اگر category پیدا نشد، به صفحه 404 برو نه صفحه اصلی
          router.replace("/404");
          return;
        }

        const data = await response.json();

        if (!data.success || !data.data) {
          // اگر category یافت نشد، به صفحه 404 برو
          router.replace("/404");
          return;
        }

        const categoryData = data.data;

        // بررسی اینکه آیا این یک subcategory است (parentId دارد)
        if (categoryData.parentId) {
          // اگر subcategory است، redirect به مسیر صحیح
          const parent = categoryData.parent;
          if (parent) {
            // استخراج subcategory slug از slug کامل
            const subcategorySlug = categoryData.slug.replace(`${parent.slug}-`, "");
            router.replace(`/${parent.slug}/${subcategorySlug}`);
            return;
          }
        }

        // این یک دسته اصلی است
        setCategorySlug(category);
      } catch (error) {
        console.error("Error validating category:", error);
        // فقط در صورت خطای واقعی به صفحه اصلی برو
        // اما بهتر است به 404 برو
        router.replace("/404");
      } finally {
        setIsValidating(false);
      }
    };

    validateCategory();
  }, [params, router]);

  // نمایش loading state سریع
  if (isValidating) {
    return null; // loading.js نمایش داده می‌شود
  }

  // اگر category پیدا نشد، صفحه 404 نمایش داده می‌شود
  if (!categorySlug) {
    return null; // redirect در useEffect انجام شده
  }

  // نمایش همه محصولات category + تمام subcategories
  // اگر محصولی نباشد، ProductsPage خودش پیام "محصولی یافت نشد" را نشان می‌دهد
  return <ProductsPage categorySlug={categorySlug} subcategorySlug={null} />;
}
