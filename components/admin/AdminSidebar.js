"use client";

import Link from "next/link";
import { Home, LogOut } from "lucide-react";
import { adminMenuItems } from "@/data/adminMenuItems";

/**
 * AdminSidebar Component
 * Sidebar navigation for admin panel
 */
export default function AdminSidebar({
  pathname,
  isSidebarOpen,
  setIsSidebarOpen,
  isMobile = false,
  onLogout,
}) {
  const menuItems = adminMenuItems(pathname);

  return (
    <aside
      className={`fixed right-0 top-0 h-screen z-40 transition-all duration-300
        bg-white/85 backdrop-blur-xl border-l border-white/60 shadow-[0_20px_60px_rgba(40,99,120,0.15)]
        ${isMobile ? "w-72" : isSidebarOpen ? "w-72" : "w-20 lg:w-24"}
        ${isMobile ? (isSidebarOpen ? "translate-x-0" : "translate-x-full") : "translate-x-0"}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-5 border-b border-gray-100/70">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#286378] via-[#43909A] to-[#6ac9d4] text-white font-black text-lg flex items-center justify-center shadow-inner">
                ای
              </div>
              {isSidebarOpen && (
                <div>
                  <p className="text-xs text-slate-500">پنل مدیریت</p>
                  <h1 className="text-lg font-extrabold text-slate-900">ایرونی</h1>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl border border-gray-200/70 bg-white/70 hover:bg-white transition-colors shadow-sm"
              aria-label={isSidebarOpen ? "بستن منو" : "باز کردن منو"}
            >
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform ${isSidebarOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!isSidebarOpen ? item.name : undefined}
                className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 border
                  ${
                    item.active
                      ? "bg-gradient-to-l from-[#286378] to-[#43909A] text-white shadow-lg shadow-[#286378]/20 border-transparent"
                      : "text-slate-700 hover:bg-white hover:border-[#286378]/15 bg-white/60 border-transparent shadow-sm"
                  }
                `}
              >
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full bg-[#286378] transition-opacity duration-300 ${
                    item.active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                  }`}
                />
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="font-medium tracking-tight">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100/80 space-y-2 bg-white/70 backdrop-blur">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white transition-all border border-transparent hover:border-[#286378]/15 shadow-sm"
          >
            <Home className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">بازگشت به سایت</span>}
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">خروج</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

