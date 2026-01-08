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
        router.replace("/404");
        return;
      }

      try {
        // بررسی سریع category و subcategory - بدون blocking
        const [categoryResponse, subcategoryResponse] = await Promise.all([
          fetch(`/api/categories/${category}`),
          fetch(`/api/categories/${category}/${subcategory}`),
        ]);

        // اگر category پیدا نشد
        if (!categoryResponse.ok && categoryResponse.status === 404) {
          router.replace("/404");
          return;
        }

        const categoryData = await categoryResponse.json();
        const subcategoryData = await subcategoryResponse.json();

        if (!categoryData.success || !categoryData.data) {
          router.replace("/404");
          return;
        }

        // بررسی اینکه آیا این یک دسته اصلی است (parentId ندارد)
        if (categoryData.data.parentId) {
          // اگر category در واقع subcategory است، redirect به مسیر صحیح
          router.replace(`/${category}`);
          return;
        }

        // اگر subcategory پیدا نشد
        if (!subcategoryResponse.ok && subcategoryResponse.status === 404) {
          // redirect به صفحه category
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
        router.replace("/404");
      } finally {
        setIsValidating(false);
      }
    };

    validateSubcategory();
  }, [params, router]);

  // نمایش loading state سریع
  if (isValidating) {
    return null; // loading.js نمایش داده می‌شود
  }

  // اگر category یا subcategory پیدا نشد، redirect در useEffect انجام شده
  if (!categorySlug || !subcategorySlug) {
    return null;
  }

  // نمایش فقط محصولات این subcategory
  // اگر محصولی نباشد، ProductsPage خودش پیام "محصولی یافت نشد" را نشان می‌دهد
  return <ProductsPage categorySlug={categorySlug} subcategorySlug={subcategorySlug} />;
}
