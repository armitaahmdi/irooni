"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, ShoppingBag, Heart } from "lucide-react";

export default function BottomNavigation() {
  const menus = [
    { name: "خانه", href: "/", icon: Home },
    { name: "علاقه‌ها", href: "/favorites", icon: Heart },
    { name: "سبد خرید", href: "/cart", icon: ShoppingBag },
    { name: "پروفایل", href: "/profile", icon: User },
  ];

  const pathname = usePathname();
  const itemRefs = useRef([]);
  const containerRef = useRef(null);

  const [active, setActive] = useState(0);
  const [circleRight, setCircleRight] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const getActiveIndex = (currentPath) => {
    if (!currentPath) return 0;
    const exactMatch = menus.findIndex((menu) => menu.href === currentPath);
    if (exactMatch !== -1) return exactMatch;
    const nestedMatch = menus.findIndex(
      (menu) =>
        menu.href !== "/" &&
        currentPath.startsWith(`${menu.href}/`)
    );
    return nestedMatch !== -1 ? nestedMatch : 0;
  };

  // تعیین active بر اساس مسیر
  useEffect(() => {
    setActive(getActiveIndex(pathname));
  }, [pathname]);

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
                <Link
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
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
