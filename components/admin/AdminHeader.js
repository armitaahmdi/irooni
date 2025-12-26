"use client";

import { Menu } from "lucide-react";
import AdminNotifications from "./AdminNotifications";

/**
 * AdminHeader Component
 * Top header for admin panel
 */
export default function AdminHeader({
  notifications,
  setNotifications,
  unreadCount,
  onMarkAsRead,
  onToggleSidebar,
  isSidebarOpen,
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 mt-3 flex items-center">
          <div className="w-full flex items-center justify-between gap-4 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_15px_40px_rgba(40,99,120,0.12)] rounded-2xl px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl border border-gray-200/70 bg-white/80 text-gray-700 hover:-translate-y-0.5 transition-all shadow-sm lg:hidden"
                aria-label={isSidebarOpen ? "بستن منوی کناری" : "باز کردن منوی کناری"}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:block">
                <p className="text-xs text-slate-500">پنل مدیریت</p>
                <p className="text-sm font-semibold text-slate-900">ایرونی</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-l from-[#286378]/15 to-[#43909A]/15 text-[#286378] text-sm font-semibold">
                نرمی رابط
              </span>
              <AdminNotifications
                notifications={notifications}
                setNotifications={setNotifications}
                unreadCount={unreadCount}
                onMarkAsRead={onMarkAsRead}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

