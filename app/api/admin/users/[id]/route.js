import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET - دریافت یک کاربر
export async function GET(request, { params }) {
  try {
    await requireAdmin();

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const user = await prisma.user.findUnique({
      where: { id },
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
    console.error("Error fetching user:", error);

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "خطا در دریافت کاربر" },
      { status: 500 }
    );
  }
}

// PUT - به‌روزرسانی کاربر
export async function PUT(request, { params }) {
  try {
    await requireAdmin();

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const body = await request.json();

    const {
      name,
      email,
      role,
    } = body;

    // بررسی وجود کاربر
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // آماده‌سازی داده‌های به‌روزرسانی
    const updateData = {};

    if (name !== undefined) updateData.name = name || null;
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
    if (role !== undefined) {
      // بررسی معتبر بودن role
      if (role !== "user" && role !== "admin") {
        return NextResponse.json(
          { error: "نقش کاربر نامعتبر است" },
          { status: 400 }
        );
      }
      updateData.role = role;
    }

    // به‌روزرسانی کاربر
    const user = await prisma.user.update({
      where: { id },
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
      message: "کاربر با موفقیت به‌روزرسانی شد",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "ایمیل تکراری است" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "خطا در به‌روزرسانی کاربر" },
      { status: 500 }
    );
  }
}

// DELETE - حذف کاربر
export async function DELETE(request, { params }) {
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

    // جلوگیری از حذف خود ادمین
    const ADMIN_PHONE = "09198718211";
    if (user.phone === ADMIN_PHONE) {
      return NextResponse.json(
        { error: "نمی‌توانید حساب ادمین اصلی را حذف کنید" },
        { status: 400 }
      );
    }

    // حذف کاربر
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "کاربر با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting user:", error);

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "خطا در حذف کاربر" },
      { status: 500 }
    );
  }
}


