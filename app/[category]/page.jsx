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
        router.push("/");
        return;
      }

      try {
        // بررسی سریع category - بدون blocking
        const response = await fetch(`/api/categories/${category}`);
        const data = await response.json();

        if (!data.success || !data.data) {
          router.push("/");
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
        router.push("/");
      } finally {
        setIsValidating(false);
      }
    };

    validateCategory();
  }, [params, router]);

  // نمایش loading state سریع
  if (isValidating || !categorySlug) {
    return null; // loading.js نمایش داده می‌شود
  }

  // نمایش همه محصولات category + تمام subcategories
  return <ProductsPage categorySlug={categorySlug} subcategorySlug={null} />;
}
