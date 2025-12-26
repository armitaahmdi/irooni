"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const { notifications, setNotifications, unreadCount, markAsRead } =
    useAdminNotifications();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5fbff] via-white to-[#eef3ff] flex relative">
      <AdminHeader
        notifications={notifications}
        setNotifications={setNotifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      <AdminSidebar
        pathname={pathname}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobile={isMobile}
        onLogout={handleLogout}
      />

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main
        className={`flex-1 transition-all duration-300 pt-20 pb-10 px-4 sm:px-6 lg:px-8 ${
          isMobile ? "mr-0" : isSidebarOpen ? "mr-72" : "mr-24"
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-8">{children}</div>
      </main>
    </div>
  );
}
