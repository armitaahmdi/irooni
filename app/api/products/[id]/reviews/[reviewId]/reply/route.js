import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// POST - پاسخ به یک نظر
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { reviewId } = resolvedParams;

    const body = await request.json();
    const { reply } = body;

    if (!reply || !reply.trim()) {
      return NextResponse.json(
        { success: false, error: "متن پاسخ الزامی است" },
        { status: 400 }
      );
    }

    // بررسی وجود نظر
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: "نظر یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی اینکه کاربر قبلاً به این نظر پاسخ نداده باشد (اختیاری - می‌توانید حذف کنید)
    // یا می‌توانید اجازه دهید کاربران چندین بار پاسخ دهند

    // ایجاد پاسخ
    const reviewReply = await prisma.reviewReply.create({
      data: {
        reviewId,
        userId: session.user.id,
        reply: reply.trim(),
        isAdminReply: session.user.role === "admin",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "پاسخ شما با موفقیت ثبت شد",
      data: reviewReply,
    });
  } catch (error) {
    console.error("Error creating review reply:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ثبت پاسخ" },
      { status: 500 }
    );
  }
}

// GET - دریافت پاسخ‌های یک نظر
export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { reviewId } = resolvedParams;

    const replies = await prisma.reviewReply.findMany({
      where: { reviewId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: replies,
    });
  } catch (error) {
    console.error("Error fetching review replies:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت پاسخ‌ها" },
      { status: 500 }
    );
  }
}

