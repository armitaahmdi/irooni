import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_PHONE = "09198718211";

/**
 * تنظیم نقش admin برای یک کاربر (فقط برای اولین بار)
 */
export async function setAdminRole(phone) {
  try {
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      throw new Error("کاربر یافت نشد");
    }

    if (user.role === "admin") {
      return { success: true, message: "کاربر قبلاً admin است" };
    }

    await prisma.user.update({
      where: { phone },
      data: { role: "admin" },
    });

    return { success: true, message: "نقش admin با موفقیت تنظیم شد" };
  } catch (error) {
    console.error("Error setting admin role:", error);
    throw error;
  }
}

/**
 * بررسی اینکه آیا کاربر فعلی admin است یا نه
 * این تابع هم شماره تلفن و هم role در دیتابیس را بررسی می‌کند
 */
export async function isAdmin() {
  try {
    const session = await auth();
    
    if (!session?.user?.phone) {
      return false;
    }

    // بررسی شماره تلفن - باید دقیقاً همان شماره باشد
    if (session.user.phone !== ADMIN_PHONE) {
      console.log(`[Admin Check] Access denied for phone: ${session.user.phone}`);
      return false;
    }

    // بررسی role در دیتابیس - باید حتماً admin باشد
    const user = await prisma.user.findUnique({
      where: { phone: session.user.phone },
      select: { role: true },
    });

    if (!user) {
      console.log(`[Admin Check] User not found in database: ${session.user.phone}`);
      return false;
    }

    if (user.role !== "admin") {
      console.log(`[Admin Check] User role is not admin: ${user.role}`);
      return false;
    }

    console.log(`[Admin Check] Admin access granted for: ${session.user.phone}`);
    return true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Middleware برای محافظت از routes ادمین
 */
export async function requireAdmin() {
  const admin = await isAdmin();
  
  if (!admin) {
    throw new Error("Unauthorized: Admin access required");
  }
  
  return true;
}

