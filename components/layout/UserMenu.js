"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { User, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAuth } from "@/store/hooks";
import { logout, fetchSession } from "@/store/slices/authSlice";
import NavigationLink from "@/components/NavigationLink";

export default function UserMenu({ mobile = false }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, isLoading } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef(null);

  const isAdmin = user?.role === "admin" || user?.phone === "09198718211";
  const displayName = user?.name || "کاربر";
  const displayInitial = user?.name?.charAt(0).toUpperCase();

  // fetch session once on mount and listen for auth changes
  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchSession());
    }

    const handleAuthChange = () => {
      dispatch(fetchSession());
    };

    window.addEventListener("auth-state-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("focus", handleAuthChange);

    return () => {
      window.removeEventListener("auth-state-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("focus", handleAuthChange);
    };
  }, [dispatch, isInitialized]);

  // close menu on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // logout
  const handleSignOut = async () => {
    try {
      await dispatch(logout()).unwrap();
      setIsOpen(false);
      startTransition(() => {
        router.push("/");
        router.refresh();
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // ---------- Loading / not initialized ----------
  if (!isInitialized) {
    return (
      <div className="px-4 py-2 rounded-xl bg-slate-200/60 animate-pulse">
        ...
      </div>
    );
  }

  // ---------- Not authenticated ----------
  if (!isAuthenticated || !user) {
    // در موبایل دکمه وارد شوید نمایش داده نمی‌شود
    if (mobile) {
      return null;
    }
    // فقط در دسکتاپ دکمه وارد شوید نمایش داده می‌شود
    return (
      <NavigationLink
        href="/login"
        className="px-5 py-2.5 rounded-xl font-semibold text-sm
          bg-gradient-to-r from-[#286378] to-[#43909A]
          text-white hover:opacity-90 transition"
      >
        وارد شوید
      </NavigationLink>
    );
  }

  // ---------- Authenticated: show profile menu ----------
  if (mobile) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="p-2.5 rounded-xl bg-[#286378]/10 text-[#286378]"
        >
          <div className="w-5 h-5 rounded-full bg-[#286378] text-white text-xs flex items-center justify-center">
            {displayInitial || <User className="w-3 h-3" />}
          </div>
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-2 w-56 bg-white border rounded-2xl shadow-xl z-50">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="text-xs text-gray-500">{user.phone}</p>
            </div>

            <NavigationLink
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
            >
              <User className="w-4 h-4" /> پروفایل
            </NavigationLink>

            {isAdmin && (
              <NavigationLink
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex gap-3 px-4 py-2.5 text-sm text-[#286378] hover:bg-slate-50 font-semibold"
              >
                <Settings className="w-4 h-4" /> پنل مدیریت
              </NavigationLink>
            )}

            <button
              onClick={handleSignOut}
              className="w-full flex gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" /> خروج
            </button>
          </div>
        )}
      </div>
    );
  }

  // Desktop
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow"
      >
        <span className="text-sm font-medium">{displayName}</span>
        <div className="w-8 h-8 rounded-full bg-[#286378] text-white flex items-center justify-center text-xs">
          {displayInitial || <User className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-2xl shadow-xl z-50">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-semibold">{displayName}</p>
            <p className="text-xs text-gray-500">{user.phone}</p>
          </div>

          <NavigationLink
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
          >
            <User className="w-4 h-4" /> پروفایل
          </NavigationLink>

          {isAdmin && (
            <NavigationLink
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex gap-3 px-4 py-2.5 text-sm text-[#286378] hover:bg-slate-50 font-semibold"
            >
              <Settings className="w-4 h-4" /> پنل مدیریت
            </NavigationLink>
          )}

          <button
            onClick={handleSignOut}
            className="w-full flex gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      )}
    </div>
  );
}
