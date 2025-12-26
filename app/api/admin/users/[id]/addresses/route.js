import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET - دریافت آدرس‌های یک کاربر
export async function GET(request, { params }) {
  try {
    await requireAdmin();

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    // بررسی وجود کاربر
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // دریافت آدرس‌های کاربر
    const addresses = await prisma.address.findMany({
      where: { userId: id },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("Error fetching user addresses:", error);

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    // اگر جدول وجود ندارد، آرایه خالی برگردان
    if (error.code === "P2021" || 
        error.message?.includes("does not exist") ||
        error.message?.includes("Unknown model")) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    return NextResponse.json(
      { error: "خطا در دریافت آدرس‌های کاربر" },
      { status: 500 }
    );
  }
}

