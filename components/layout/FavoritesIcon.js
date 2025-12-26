"use client";

import { useEffect } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/store/hooks";
import { fetchSession } from "@/store/slices/authSlice";
import { selectFavoritesCount } from "@/store/slices/favoritesSlice";

export default function FavoritesIcon({ mobile = false }) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();
  const favoritesCount = useAppSelector(selectFavoritesCount);

  // Fetch session on mount and listen for auth changes
  useEffect(() => {
    // Initial fetch
    dispatch(fetchSession());

    // Listen for auth state changes
    const handleAuthChange = () => {
      dispatch(fetchSession());
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("auth-state-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth-state-change", handleAuthChange);
    };
  }, [dispatch]);

  // اگر کاربر لاگین نکرده، چیزی نمایش نمی‌دهیم
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Link
      href="/favorites"
      className={`relative flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95 group ${
        mobile ? "w-9 h-9" : ""
      }`}
      title="علاقه‌مندی‌ها"
    >
      <Heart className={`transition-transform duration-300 group-hover:scale-110 group-hover:fill-red-500 text-red-500 ${
        mobile ? "w-5 h-5" : "w-5 h-5"
      }`} />
      {/* تعداد علاقه‌مندی‌ها */}
      {favoritesCount > 0 && (
        <span className={`absolute bg-gradient-to-br from-red-500 to-pink-500 text-white font-bold rounded-full flex items-center justify-center shadow-lg ring-2 ring-white ${
          mobile 
            ? "-top-1 -right-1 text-[10px] w-4 h-4" 
            : "-top-1 -right-1 text-[10px] w-4 h-4"
        }`}>
          {favoritesCount > 9 ? "9+" : favoritesCount}
        </span>
      )}
    </Link>
  );
}
