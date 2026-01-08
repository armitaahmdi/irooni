"use client";

import {
  LayoutDashboard,
  Package,
  MapPin,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Smartphone,
} from "lucide-react";

/**
 * ProfileSidebar Component
 * Sidebar navigation for profile page
 */
export default function ProfileSidebar({
  user,
  activeSection,
  setActiveSection,
  onSignOut,
}) {
  const menuItems = [
    { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
    { id: "orders", label: "سفارش‌ها", icon: Package },
    { id: "addresses", label: "آدرس‌ها", icon: MapPin },
    { id: "reviews", label: "دیدگاه‌ها", icon: MessageSquare },
    { id: "account", label: "اطلاعات حساب", icon: User },
    { id: "settings", label: "تنظیمات", icon: Settings },
  ];

  return (
    <aside className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* User Info Header */}
        <div className="bg-gradient-to-br from-[#286378] to-[#43909A] p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-white/80">شماره موبایل</p>
              <p className="text-lg font-bold">{user?.phone}</p>
            </div>
          </div>
          {user?.name && (
            <p className="text-sm text-white/90">{user.name}</p>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-[#286378] to-[#43909A] text-white shadow-md"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-[#A2CFFF]/20 hover:to-[#A2CFFF]/10 hover:text-[#286378]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium flex-1 text-right">{item.label}</span>
                  </button>
                </li>
              );
            })}
            <li>
              <button
                onClick={onSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">خروج از حساب کاربری</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

