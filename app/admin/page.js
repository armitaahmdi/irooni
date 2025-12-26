"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ClipboardList,
  FileText,
  ImageIcon,
  MessageSquare,
  Package,
  PackagePlus,
  ShoppingCart,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import { checkAdminAccess } from "@/lib/admin-client";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    todaySales: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchStats();
    }
  }, [isAuthorized]);

  const checkAuth = async () => {
    try {
      const { isAdmin } = await checkAdminAccess();

      if (isAdmin) {
        setIsAuthorized(true);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const formatPrice = (value = 0) => {
    return new Intl.NumberFormat("fa-IR").format(value) + " تومان";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378] mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const statCards = [
    {
      title: "محصولات",
      value: stats.products,
      href: "/admin/products",
      icon: Package,
      accent: "from-[#286378] to-[#43909A]",
    },
    {
      title: "کاربران",
      value: stats.users,
      href: "/admin/users",
      icon: Users,
      accent: "from-emerald-500 to-teal-400",
    },
    {
      title: "سفارشات",
      value: stats.orders,
      href: "/admin/orders",
      icon: ShoppingCart,
      accent: "from-sky-500 to-indigo-400",
    },
    {
      title: "فروش امروز",
      value: stats.todaySales,
      href: "/admin/orders?filter=today",
      icon: TrendingUp,
      accent: "from-amber-400 to-orange-400",
      isCurrency: true,
    },
  ];

  const quickLinks = [
    {
      title: "افزودن محصول جدید",
      description: "ثبت سریع و ساده محصول",
      href: "/admin/products/new",
      icon: PackagePlus,
    },
    {
      title: "مدیریت سفارشات",
      description: "پیگیری وضعیت و پرداخت",
      href: "/admin/orders",
      icon: ClipboardList,
    },
    {
      title: "کدهای تخفیف",
      description: "ساخت کمپین لحظه‌ای",
      href: "/admin/coupons",
      icon: Tag,
    },
    {
      title: "بنرها و اسلایدها",
      description: "آپلود و تنظیم نمایش",
      href: "/admin/slides",
      icon: ImageIcon,
    },
    {
      title: "مقالات و وبلاگ",
      description: "مدیریت محتوا و انتشار",
      href: "/admin/articles",
      icon: FileText,
    },
    {
      title: "پیام‌های تماس",
      description: "پاسخگویی به مشتریان",
      href: "/admin/contact-messages",
      icon: MessageSquare,
    },
  ];

  const actionLinks = [
    { title: "محصولات", href: "/admin/products", icon: Package },
    { title: "کاربران", href: "/admin/users", icon: Users },
    { title: "سفارشات", href: "/admin/orders", icon: ShoppingCart },
    { title: "نظرات", href: "/admin/reviews", icon: Sparkles },
    { title: "کد تخفیف", href: "/admin/coupons", icon: Tag },
    { title: "مقالات", href: "/admin/articles", icon: FileText },
    { title: "بنرها", href: "/admin/slides", icon: ImageIcon },
    { title: "پیام‌ها", href: "/admin/contact-messages", icon: MessageSquare },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <div className="bg-white/80 border border-white/70 rounded-3xl shadow-[0_25px_60px_rgba(40,99,120,0.12)] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">سلام، خوش آمدید</p>
              <h1 className="text-3xl font-extrabold text-slate-900">داشبورد مدیریت</h1>
              <p className="text-sm text-slate-600 mt-2">
                نمای کلی فروشگاه، آمار و مسیرهای پر استفاده در یک نگاه
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="px-3 py-1 rounded-full bg-[#286378]/10 text-[#286378] font-semibold">
                  ظاهر نرم و شیشه‌ای
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-semibold">
                  ریسپانسیو موبایل
                </span>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end gap-3">
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-l from-[#286378] to-[#43909A] text-white shadow-lg shadow-[#286378]/25">
                <span className="text-xs opacity-80">وضعیت امروز</span>
                <span className="block text-sm font-semibold">به‌روز و آماده کار</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Sparkles className="w-4 h-4 text-[#286378]" />
                <span>سریع، نرم و خوانا</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              const formattedValue = card.isCurrency
                ? formatPrice(card.value)
                : new Intl.NumberFormat("fa-IR").format(card.value || 0);

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group relative overflow-hidden rounded-2xl bg-white/85 border border-white/70 shadow-[0_20px_50px_rgba(40,99,120,0.12)] hover:-translate-y-1 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">{card.title}</p>
                      <p className="mt-1 text-2xl font-extrabold text-[#286378]">
                        {formattedValue}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.accent} text-white flex items-center justify-center shadow-lg shadow-[#286378]/15`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#286378] via-[#43909A] to-[#62b8c4] text-white rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(40,99,120,0.22)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-white/80">دسترسی سریع</p>
              <h2 className="text-2xl font-bold mt-1">عملیات روزانه</h2>
              <p className="text-sm text-white/80 mt-2">
                میانبرهای ضروری برای شروع سریع روی موبایل و دسکتاپ
              </p>
            </div>
            <Sparkles className="w-7 h-7 text-white/90" />
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-white/10 border border-white/20 hover:border-white/50 transition-all hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-white/80">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white/80 border border-white/70 rounded-3xl shadow-[0_20px_50px_rgba(40,99,120,0.12)] p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-slate-900">میانبرهای مدیریت</h2>
            <span className="hidden md:inline text-xs text-slate-500">
              شبکه ۲ ستونی روی موبایل، ۴ ستونی روی دسکتاپ
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {actionLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/85 border border-white/70 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#286378]/10 text-[#286378] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-800">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-white/80 border border-white/70 rounded-3xl shadow-[0_20px_50px_rgba(40,99,120,0.12)] p-6 sm:p-7 flex flex-col gap-4">
          <div>
            <p className="text-xs text-slate-500">راهنمای سریع</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">تجربه نرم و موبایلی</h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="mt-1 w-2 h-2 rounded-full bg-[#286378]"></span>
              منو با یک لمس در موبایل باز و بسته می‌شود؛ پس از ورود، سریع به مقصد بروید.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-2 h-2 rounded-full bg-[#286378]"></span>
              کارت‌های شیشه‌ای و سایه نرم، تمرکز را روی محتوا و آمار نگه می‌دارند.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-2 h-2 rounded-full bg-[#286378]"></span>
              شبکه‌ها روی موبایل دو ستونه می‌شوند تا لمس و خوانایی ساده‌تر باشد.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

