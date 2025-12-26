"use client";

import { useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * NavigationLink Component
 * Optimized Link with useTransition for instant navigation feedback
 */
export default function NavigationLink({ 
  href, 
  children, 
  className = "",
  prefetch = true,
  ...props 
}) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const isActive = pathname === href;

  const handleClick = (e) => {
    // Only use transition for client-side navigation
    if (href.startsWith('/')) {
      startTransition(() => {
        // Navigation will happen automatically via Next.js Link
      });
    }
  };

  return (
    <Link
      href={href}
      prefetch={prefetch}
      onClick={handleClick}
      className={`${className} ${isPending ? 'opacity-70' : ''} ${isActive ? 'active' : ''}`}
      {...props}
    >
      {children}
    </Link>
  );
}

