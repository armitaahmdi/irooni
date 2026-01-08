"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Hide header on login page and admin pages
  if (pathname === "/login" || pathname?.startsWith("/admin")) {
    return null;
  }
  
  return <Header />;
}

