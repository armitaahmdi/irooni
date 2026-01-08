import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - دریافت اطلاعات پروفایل کاربر
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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

    if (!user) {
      return NextResponse.json(
        { error: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "خطا در دریافت اطلاعات پروفایل" },
      { status: 500 }
    );
  }
}

// PUT - به‌روزرسانی اطلاعات پروفایل کاربر
export async function PUT(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email } = body;

    // بررسی وجود کاربر
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // آماده‌سازی داده‌های به‌روزرسانی
    const updateData = {};

    if (name !== undefined) {
      updateData.name = name || null;
    }

    if (email !== undefined) {
      // بررسی یکتایی email (اگر تغییر کرده باشد)
      if (email && email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email },
        });

        if (emailExists) {
          return NextResponse.json(
            { error: "این ایمیل قبلاً استفاده شده است" },
            { status: 400 }
          );
        }
      }
      updateData.email = email || null;
    }

    // به‌روزرسانی کاربر
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
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
      message: "اطلاعات با موفقیت به‌روزرسانی شد",
      data: user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "ایمیل تکراری است" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "خطا در به‌روزرسانی اطلاعات" },
      { status: 500 }
    );
  }
}

