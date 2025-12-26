"use client";

import { useSearchParams } from "next/navigation";
import ProductsPage from "@/components/ProductsPage";

export default function AllProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || null;

  return <ProductsPage searchQuery={searchQuery} />;
}

