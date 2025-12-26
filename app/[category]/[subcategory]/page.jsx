"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductsPage from "@/components/ProductsPage";

export default function SubcategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [categorySlug, setCategorySlug] = useState(null);
  const [subcategorySlug, setSubcategorySlug] = useState(null);

  useEffect(() => {
    const validateSubcategory = async () => {
      const resolvedParams = params instanceof Promise ? await params : params;
      const category = resolvedParams?.category;
      const subcategory = resolvedParams?.subcategory;

      if (!category || !subcategory) {
        router.push("/");
        return;
      }

      try {
        // بررسی سریع category و subcategory - بدون blocking
        const [categoryResponse, subcategoryResponse] = await Promise.all([
          fetch(`/api/categories/${category}`),
          fetch(`/api/categories/${category}/${subcategory}`),
        ]);

        const categoryData = await categoryResponse.json();
        const subcategoryData = await subcategoryResponse.json();

        if (!categoryData.success || !categoryData.data) {
          router.push("/");
          return;
        }

        // بررسی اینکه آیا این یک دسته اصلی است (parentId ندارد)
        if (categoryData.data.parentId) {
          // اگر subcategory است، redirect به مسیر صحیح
          router.replace(`/${category}`);
          return;
        }

        if (!subcategoryData.success || !subcategoryData.data) {
          // اگر subcategory پیدا نشد، redirect به صفحه category
          router.replace(`/${category}`);
          return;
        }

        // بررسی اینکه subcategory متعلق به این category است
        if (!subcategoryData.data.parentId || subcategoryData.data.parent?.slug !== category) {
          router.replace(`/${category}`);
          return;
        }

        // همه چیز درست است
        setCategorySlug(category);
        setSubcategorySlug(subcategory);
      } catch (error) {
        console.error("Error validating subcategory:", error);
        router.push("/");
      } finally {
        setIsValidating(false);
      }
    };

    validateSubcategory();
  }, [params, router]);

  // نمایش loading state سریع
  if (isValidating || !categorySlug || !subcategorySlug) {
    return null; // loading.js نمایش داده می‌شود
  }

  // نمایش فقط محصولات این subcategory
  return <ProductsPage categorySlug={categorySlug} subcategorySlug={subcategorySlug} />;
}
