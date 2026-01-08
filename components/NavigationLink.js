"use client";

import { useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/**
 * NavigationLink Component
 * Optimized Link with useTransition for instant navigation feedback
 */
export default function NavigationLink({ 
  href, 
  children, 
  className = "",
  prefetch = true,
  onClick,
  ...props 
}) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === href;

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }

    if (event.defaultPrevented) {
      return;
    }

    // Use transition for client-side navigation to mark it as non-urgent
    // This allows React to prioritize other updates
    if (href.startsWith('/') && !isActive) {
      startTransition(() => {
        // Mark navigation as transition - Next.js Link will handle actual navigation
        // This helps React prioritize rendering and improves perceived performance
      });
    }
  };

  return (
    <Link
      href={href}
      prefetch={prefetch}
      onClick={handleClick}
      className={`${className} ${isPending ? 'opacity-70 transition-opacity' : ''} ${isActive ? 'active' : ''}`}
      {...props}
    >
      {children}
    </Link>
  );
}
