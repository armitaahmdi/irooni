"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductsPage from "@/components/ProductsPage";

function ProductsPageWithSearch() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || null;

  return <ProductsPage searchQuery={searchQuery} />;
}

export default function AllProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>}>
      <ProductsPageWithSearch />
    </Suspense>
  );
}

