import {
  Package,
  Users,
  ShoppingCart,
  FileText,
  ImageIcon,
  MessageSquare,
  Tag,
  Star,
  LayoutDashboard,
} from "lucide-react";

/**
 * Admin menu items configuration
 */
export const adminMenuItems = (pathname) => [
  {
    name: "داشبورد",
    href: "/admin",
    icon: LayoutDashboard,
    active: pathname === "/admin",
  },
  {
    name: "محصولات",
    href: "/admin/products",
    icon: Package,
    active: pathname.startsWith("/admin/products"),
  },
  {
    name: "کاربران",
    href: "/admin/users",
    icon: Users,
    active: pathname.startsWith("/admin/users"),
  },
  {
    name: "سفارشات",
    href: "/admin/orders",
    icon: ShoppingCart,
    active: pathname.startsWith("/admin/orders"),
  },
  {
    name: "مقالات",
    href: "/admin/articles",
    icon: FileText,
    active: pathname.startsWith("/admin/articles"),
  },
  {
    name: "بنرها",
    href: "/admin/slides",
    icon: ImageIcon,
    active: pathname.startsWith("/admin/slides"),
  },
  {
    name: "پیام‌های تماس",
    href: "/admin/contact-messages",
    icon: MessageSquare,
    active: pathname.startsWith("/admin/contact-messages"),
  },
  {
    name: "کدهای تخفیف",
    href: "/admin/coupons",
    icon: Tag,
    active: pathname.startsWith("/admin/coupons"),
  },
  {
    name: "نظرات",
    href: "/admin/reviews",
    icon: Star,
    active: pathname.startsWith("/admin/reviews"),
  },
];

