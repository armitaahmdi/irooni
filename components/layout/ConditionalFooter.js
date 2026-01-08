"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on login page and admin pages
  if (pathname === "/login" || pathname === "/register" || pathname?.startsWith("/admin")) {
    return null;
  }
  
  return <Footer />;
}

