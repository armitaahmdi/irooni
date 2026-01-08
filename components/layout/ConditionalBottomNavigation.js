"use client";

import { usePathname } from "next/navigation";
import BottomNavigation from "./BottomNavigation";

export default function ConditionalBottomNavigation() {
  const pathname = usePathname();
  
  // Hide bottom navigation on login, register, admin pages, and product detail pages
  if (
    pathname === "/login" || 
    pathname === "/register" || 
    pathname?.startsWith("/admin") ||
    pathname?.match(/\/[^/]+\/[^/]+\/[^/]+$/) // Product detail pages: /category/subcategory/productSlug
  ) {
    return null;
  }
  
  return <BottomNavigation />;
}

