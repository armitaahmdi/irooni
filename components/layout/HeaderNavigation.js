"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import FavoritesIcon from "./FavoritesIcon";
import UserMenu from "./UserMenu";

/**
 * HeaderNavigation Component
 * Navigation links, cart, favorites, and user menu
 */
export default function HeaderNavigation({ cartItemsCount, isMobile = false }) {
  if (isMobile) {
    return (
      <div className="flex items-center gap-1.5">
        <FavoritesIcon mobile={true} />
        <Link
          href="/cart"
          prefetch={true}
          className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#286378]/10 to-[#43909A]/10 hover:from-[#286378]/20 hover:to-[#43909A]/20 text-[#286378] active:scale-95 transition-all duration-300 border border-[#286378]/20"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#286378] to-[#43909A] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-lg ring-2 ring-white animate-pulse">
              {cartItemsCount > 99 ? "99+" : cartItemsCount}
            </span>
          )}
        </Link>
        <UserMenu mobile={true} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 justify-start">
      <Link
        href="/cart"
        prefetch={true}
        className="relative flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <ShoppingBag className="w-5 h-5 text-gray-700" />
        {cartItemsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#FFD60A] to-[#FFD60A]/90 text-[#2F2F2F] text-xs font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
            {cartItemsCount > 99 ? "99+" : cartItemsCount}
          </span>
        )}
      </Link>

      <div className="flex items-center">
        <FavoritesIcon />
      </div>

      <UserMenu />
    </div>
  );
}

