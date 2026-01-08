import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// POST - تنظیم نقش admin برای یک کاربر
export async function POST(request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "شماره موبایل الزامی است" },
        { status: 400 }
      );
    }

    // پیدا کردن کاربر
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json(
        { error: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // به‌روزرسانی نقش به admin
    const updatedUser = await prisma.user.update({
      where: { phone },
      data: { role: "admin" },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "نقش کاربر با موفقیت به admin تغییر یافت",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error setting admin role:", error);

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "خطا در تغییر نقش کاربر" },
      { status: 500 }
    );
  }
}

