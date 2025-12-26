"use client";

import { usePathname } from "next/navigation";
import SocialSidebar from "./SocialSidebar";

export default function ConditionalSocialSidebar() {
  const pathname = usePathname();
  
  // Hide social sidebar on login, register, and admin pages
  if (pathname === "/login" || pathname === "/register" || pathname?.startsWith("/admin")) {
    return null;
  }
  
  return <SocialSidebar />;
}

