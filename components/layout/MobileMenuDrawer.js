"use client";

import Link from "next/link";
import { X, ChevronDown, ChevronLeft, Info, Mail, FileText, Ruler, Shield, BookOpen, Package, Shirt } from "lucide-react";
import { usePathname } from "next/navigation";
import { productCategories } from "@/data/categories";

/**
 * MobileMenuDrawer Component
 * Bottom sheet mobile menu with categories and site pages
 */
export default function MobileMenuDrawer({
  isOpen,
  onClose,
  expandedCategory,
  onToggleCategory,
}) {
  const pathname = usePathname();

  // Icon mapping for categories
  const getCategoryIcon = (slug) => {
    const iconMap = {
      tshirt: <Shirt className="w-4 h-4" />,
      shirt: <Shirt className="w-4 h-4" />,
      jacket: <Package className="w-4 h-4" />,
      sweatshirt: <Package className="w-4 h-4" />,
      "sport-set": <Package className="w-4 h-4" />,
      pants: <Package className="w-4 h-4" />,
      "sport-coat": <Package className="w-4 h-4" />,
      shoes: <Package className="w-4 h-4" />,
      accessories: <Package className="w-4 h-4" />,
    };
    return iconMap[slug] || <Package className="w-4 h-4" />;
  };

  // Site pages menu items
  const sitePages = [
    {
      name: "محصولات",
      href: "/products",
      icon: Package,
      description: "همه محصولات",
    },
    {
      name: "درباره ما",
      href: "/about",
      icon: Info,
      description: "درباره پوشاک ایرونی",
    },
    {
      name: "تماس با ما",
      href: "/contact",
      icon: Mail,
      description: "ارتباط با ما",
    },
    {
      name: "مجله",
      href: "/blogs",
      icon: BookOpen,
      description: "مقالات و اخبار",
    },
    {
      name: "راهنمای سایز",
      href: "/size-guide",
      icon: Ruler,
      description: "جدول سایز",
    },
    {
      name: "قوانین و مقررات",
      href: "/terms",
      icon: FileText,
      description: "شرایط استفاده",
    },
    {
      name: "حریم خصوصی",
      href: "/privacy",
      icon: Shield,
      description: "سیاست حریم خصوصی",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
        style={{
          boxShadow: "0 -8px 32px rgba(40, 99, 120, 0.12), 0 0 60px rgba(0, 0, 0, 0.08)",
          animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">منو</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95"
            aria-label="بستن منو"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Categories Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              دسته‌بندی محصولات
            </h3>
            <ul className="space-y-1.5">
              {productCategories.map((category, idx) => (
                <li key={category.slug}>
                  {category.subcategories.length > 0 ? (
                    <div className="mb-0.5">
                      <button
                        onClick={() => onToggleCategory(category.slug)}
                        className={`group w-full flex items-center gap-3 py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                          expandedCategory === category.slug
                            ? "text-[#286378] bg-[#286378]/10 shadow-sm"
                            : "text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-[#286378] active:scale-[0.98]"
                        }`}
                      >
                        <span
                          className={
                            expandedCategory === category.slug
                              ? "text-[#286378]"
                              : "text-gray-400 group-hover:text-[#286378]"
                          }
                        >
                          {getCategoryIcon(category.slug)}
                        </span>
                        <span className="flex-1 text-right">{category.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                            expandedCategory === category.slug ? "rotate-180 text-[#286378]" : ""
                          }`}
                        />
                      </button>

                      {expandedCategory === category.slug && (
                        <ul className="mt-2 mr-3 space-y-1 animate-fadeIn">
                          {category.subcategories.map((subcat, idx) => (
                            <li key={idx}>
                              <Link
                                href={`/${category.slug}/${subcat.slug}`}
                                className="group flex items-center gap-2.5 py-2.5 px-4 text-sm text-gray-600 hover:text-[#286378] bg-white hover:bg-gray-50 rounded-xl transition-all duration-200"
                                onClick={onClose}
                              >
                                <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-[#286378] transition-colors"></span>
                                <span>{subcat.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={`/${category.slug}`}
                      className="group flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-[#286378] rounded-2xl transition-all duration-300 active:scale-[0.98]"
                      onClick={onClose}
                    >
                      <span className="text-gray-400 group-hover:text-[#286378]">
                        {getCategoryIcon(category.slug)}
                      </span>
                      <span>{category.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Site Pages Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              صفحات سایت
            </h3>
            <div className="space-y-2">
              {sitePages.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? "bg-gradient-to-r from-[#286378]/10 to-[#43909A]/10 text-[#286378]"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                        isActive
                          ? "bg-[#286378] text-white"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold text-sm ${isActive ? "text-[#286378]" : "text-gray-900"}`}>
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-center text-gray-400">
            ساخته شده با <span className="text-red-500">❤️</span> برای شما
          </p>
        </div>
      </div>
    </div>
  );
}
