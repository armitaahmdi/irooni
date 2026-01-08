/**
 * Client-side helper برای بررسی دسترسی admin
 * این فایل فقط برای استفاده در frontend است
 */

const ADMIN_PHONE = "09198718211";

/**
 * بررسی اینکه آیا کاربر فعلی admin است یا نه (client-side)
 * این تابع هم شماره تلفن و هم role را از session بررسی می‌کند
 */
export async function checkAdminAccess() {
  try {
    const response = await fetch("/api/auth/session");
    const session = await response.json();

    if (!session?.user) {
      return { isAdmin: false, reason: "No session" };
    }

    // بررسی شماره تلفن
    if (session.user.phone !== ADMIN_PHONE) {
      return { isAdmin: false, reason: "Phone mismatch" };
    }

    // بررسی role - باید حتماً admin باشد
    if (session.user.role !== "admin") {
      return { isAdmin: false, reason: "Role is not admin" };
    }

    return { isAdmin: true };
  } catch (error) {
    console.error("Error checking admin access:", error);
    return { isAdmin: false, reason: "Error" };
  }
}


