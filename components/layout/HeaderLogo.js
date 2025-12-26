"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * HeaderLogo Component
 * Logo and brand name for header
 */
export default function HeaderLogo({ isMobile = false }) {
  if (isMobile) {
    return (
      <Link href="/" className="flex items-center justify-center">
        <Image
          src="/logo/main-logo.png"
          alt="ایرونی"
          width={48}
          height={48}
          priority
          quality={100}
          className="w-12 h-12 object-contain hover:scale-105 transition-transform duration-300"
          unoptimized
        />
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4 justify-end">
      <Link
        href="/"
        className="flex items-center gap-4 hover:opacity-90 transition-all duration-300 group"
      >
        <div className="relative w-24 h-24 bg-white rounded-lg overflow-hidden shadow-sm flex items-center justify-center">
          <Image
            src="/logo/main-logo.png"
            alt="ایرونی"
            width={112}
            height={112}
            priority
            quality={100}
            className="w-[100px] h-[100px] object-contain transition-transform duration-300 group-hover:scale-110"
            unoptimized
          />
        </div>
        <span className="text-2xl font-extrabold bg-gradient-to-r from-[#286378] to-[#43909A] bg-clip-text text-transparent tracking-tight whitespace-nowrap">
          پوشاک ایرونی
        </span>
      </Link>
    </div>
  );
}

