"use client";

import { useState, useEffect, useRef } from "react";
import { User, LogOut, ChevronDown, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { useAuth } from "@/store/hooks";
import { logout, fetchSession } from "@/store/slices/authSlice";
import NavigationLink from "@/components/NavigationLink";

export default function UserMenu({ mobile = false }) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);
  
  // بررسی اینکه آیا کاربر admin است
  const isAdmin = user?.role === "admin" || user?.phone === "09198718211";

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await dispatch(logout()).unwrap();
      setIsOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!isAuthenticated || !user) {
    if (mobile) {
      return (
        <NavigationLink
          href="/login"
          className="px-5 py-2.5 bg-white text-[#286378] text-sm font-semibold rounded-xl hover:bg-[#A2CFFF] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          وارد شوید
        </NavigationLink>
      );
    }
    return (
      <NavigationLink
        href="/login"
        className="text-sm font-semibold text-white bg-gradient-to-r from-[#286378] to-[#43909A] hover:from-[#43909A] hover:to-[#286378] transition-all duration-300 px-5 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 shadow-md"
      >
        وارد شوید
      </NavigationLink>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-2">
        {isAdmin && (
          <NavigationLink
            href="/admin"
            className="p-2.5 rounded-xl text-[#286378] hover:bg-gradient-to-br hover:from-[#FFD60A]/20 hover:to-[#FFD60A]/10 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 relative group"
            title="پنل مدیریت"
          >
            <Settings className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FFD60A] rounded-full border-2 border-white"></div>
          </NavigationLink>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-700 hover:text-[#286378] transition-all duration-300 group"
        >
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all">
            <span className="text-sm font-medium text-gray-900">{user.name || "کاربر"}</span>
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#286378] to-[#43909A] flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                {user.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white/98 backdrop-blur-md border border-gray-200/80 shadow-2xl rounded-2xl py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">
                {user.name || "کاربر"}
              </p>
              <p className="text-xs text-gray-500 mt-1">{user.phone}</p>
            </div>
            <div className="py-2">
              <NavigationLink
                href="/profile"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:text-[#286378] hover:bg-gradient-to-r hover:from-[#A2CFFF]/25 hover:to-[#A2CFFF]/15 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>پروفایل</span>
              </NavigationLink>
              {isAdmin && (
                <NavigationLink
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#286378] hover:bg-gradient-to-r hover:from-[#FFD60A]/25 hover:to-[#FFD60A]/15 transition-all duration-200 font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>پنل مدیریت</span>
                </NavigationLink>
              )}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
