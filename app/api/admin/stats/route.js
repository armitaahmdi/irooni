import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    // بررسی دسترسی ادمین
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    // محاسبه آمار
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // تعداد کاربران
    const usersCount = await prisma.user.count();

    // تعداد محصولات
    const productsCount = await prisma.product.count();

    // تعداد سفارشات
    const ordersCount = await prisma.order.count();

    // فروش امروز (مجموع مبلغ سفارشات امروز)
    const todayOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          not: "cancelled",
        },
      },
      select: {
        totalAmount: true,
      },
    });

    // محاسبه مجموع فروش امروز
    const todaySales = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    return NextResponse.json({
      success: true,
      data: {
        users: usersCount,
        products: productsCount,
        orders: ordersCount,
        todaySales: Math.round(todaySales),
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "خطا در دریافت آمار",
      },
      { status: 500 }
    );
  }
}

