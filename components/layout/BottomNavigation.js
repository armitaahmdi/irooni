"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Home, User, ShoppingBag, Heart } from "lucide-react";
import NavigationLink from "@/components/NavigationLink";
import { useAppDispatch, useAuth } from "@/store/hooks";
import { fetchSession } from "@/store/slices/authSlice";

export default function BottomNavigation() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized } = useAuth();
  
  const menus = useMemo(() => [
    { name: "خانه", href: "/", icon: Home },
    { name: "علاقه‌ها", href: "/favorites", icon: Heart },
    { name: "سبد خرید", href: "/cart", icon: ShoppingBag },
    { name: "پروفایل", href: isAuthenticated ? "/profile" : "/login", icon: User },
  ], [isAuthenticated]);

  const pathname = usePathname();
  const itemRefs = useRef([]);
  const containerRef = useRef(null);

  const [active, setActive] = useState(0);
  const [circleRight, setCircleRight] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const getActiveIndex = useCallback((currentPath) => {
    if (!currentPath) return 0;
    
    // بررسی مسیر دقیق
    const exactMatch = menus.findIndex((menu) => menu.href === currentPath);
    if (exactMatch !== -1) return exactMatch;
    
    // بررسی مسیرهای تو در تو (مثل /profile/orders)
    const nestedMatch = menus.findIndex(
      (menu) =>
        menu.href !== "/" &&
        currentPath.startsWith(`${menu.href}/`)
    );
    if (nestedMatch !== -1) return nestedMatch;
    
    // اگر در صفحه login هستیم و لاگین شده‌ایم، آیکون پروفایل را active کن
    if (currentPath === "/login" && isAuthenticated) {
      const profileIndex = menus.findIndex((menu) => menu.href === "/profile");
      if (profileIndex !== -1) return profileIndex;
    }
    
    // اگر در صفحه profile هستیم ولی لاگین نیستیم، آیکون login را active کن
    if (currentPath === "/profile" && !isAuthenticated) {
      const loginIndex = menus.findIndex((menu) => menu.href === "/login");
      if (loginIndex !== -1) return loginIndex;
    }
    
    return 0;
  }, [menus, isAuthenticated]);

  // تعیین active بر اساس مسیر
  useEffect(() => {
    setActive(getActiveIndex(pathname));
  }, [pathname, getActiveIndex]);

  // محاسبه موقعیت دایره (RTL → از راست)
  useEffect(() => {
    const updatePosition = () => {
      const activeItem = itemRefs.current[active];
      const container = containerRef.current;
      if (!activeItem || !container) return;

      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      const right =
        containerRect.right -
        (itemRect.left + itemRect.width / 2);

      setCircleRight(right);
    };

    requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => window.removeEventListener("resize", updatePosition);
  }, [active]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch session on mount and listen for auth changes
  useEffect(() => {
    // همیشه در mount session را fetch کن تا بعد از reload هم به‌روز باشد
    dispatch(fetchSession());

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
  }, [dispatch]); // فقط dispatch - فقط یک بار در mount

  if (!isMounted) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      dir="rtl"
      aria-label="Bottom navigation"
    >
      <div className="bg-[#286378] px-6 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] rounded-t-2xl shadow-lg relative">
        {/* دایره شناور */}
        {circleRight !== null && (
          <span
            className="absolute -top-5 h-16 w-16 rounded-full bg-[#FFD60A] border-4 border-white flex items-center justify-center transition-all duration-300 motion-reduce:transition-none"
            style={{
              right: `${circleRight}px`,
              transform: "translateX(50%)",
            }}
          >
            {/* notch راست */}
            <span
              className="absolute top-4 -right-[18px] w-3.5 h-3.5 rounded-tl-[11px]"
              style={{ boxShadow: "-4px -5px 0 0 #fff" }}
            />
            {/* notch چپ */}
            <span
              className="absolute top-4 -left-[18px] w-3.5 h-3.5 rounded-tr-[11px]"
              style={{ boxShadow: "4px -5px 0 0 #fff" }}
            />

            {(() => {
              const Icon = menus[active].icon;
              return <Icon className="w-7 h-7 text-[#2F2F2F]" />;
            })()}
          </span>
        )}

        {/* آیتم‌ها */}
        <ul
          ref={containerRef}
          className="flex justify-between relative"
        >
          {menus.map((menu, i) => {
            const Icon = menu.icon;
            const isActive = i === active;

            return (
              <li
                key={menu.name}
                ref={(el) => (itemRefs.current[i] = el)}
                className="w-16"
              >
                <NavigationLink
                  href={menu.href}
                  onClick={() => setActive(i)}
                  className="group flex flex-col items-center pt-6 pb-2 select-none transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#286378] motion-reduce:transition-none active:scale-[0.98]"
                  aria-current={isActive ? "page" : undefined}
                  aria-label={menu.name}
                >
                  {!isActive && (
                    <Icon className="w-6 h-6 text-white/70 transition-colors duration-200 group-hover:text-white motion-reduce:transition-none" />
                  )}

                  <span
                    className={`text-xs mt-2 transition-all motion-reduce:transition-none ${
                      isActive
                        ? "translate-y-4 opacity-100 text-white font-semibold"
                        : "opacity-0 translate-y-8"
                    }`}
                  >
                    {menu.name}
                  </span>
                </NavigationLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
