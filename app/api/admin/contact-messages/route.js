import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET - دریافت لیست پیام‌های تماس
export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const isRead = searchParams.get("isRead");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where = {};
    
    if (isRead !== null && isRead !== undefined) {
      where.isRead = isRead === "true";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در دریافت پیام‌ها",
      },
      { status: 500 }
    );
  }
}

// PATCH - به‌روزرسانی وضعیت خوانده شدن یا پاسخ
export async function PATCH(request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { id, isRead, reply } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "شناسه پیام الزامی است",
        },
        { status: 400 }
      );
    }

    const updateData = {};
    if (isRead !== undefined) {
      updateData.isRead = isRead;
    }
    if (reply !== undefined) {
      updateData.reply = reply;
      updateData.repliedAt = new Date();
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Error updating contact message:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در به‌روزرسانی پیام",
      },
      { status: 500 }
    );
  }
}

// DELETE - حذف پیام
export async function DELETE(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "شناسه پیام الزامی است",
        },
        { status: 400 }
      );
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "پیام با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در حذف پیام",
      },
      { status: 500 }
    );
  }
}

