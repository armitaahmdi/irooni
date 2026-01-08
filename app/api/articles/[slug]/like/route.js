import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// POST - لایک/آنلایک کردن مقاله
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
    const { slug } = resolvedParams;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "شناسه مقاله الزامی است" },
        { status: 400 }
      );
    }

    // پیدا کردن مقاله
    const article = await prisma.article.findUnique({
      where: { slug },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "مقاله یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی اینکه کاربر قبلاً لایک کرده است یا نه
    const existingLike = await prisma.articleLike.findUnique({
      where: {
        articleId_userId: {
          articleId: article.id,
          userId: session.user.id,
        },
      },
    });

    let likeCount = article.likeCount;
    let isLiked = false;

    if (existingLike) {
      // اگر قبلاً لایک کرده، لایک را حذف کن
      await prisma.articleLike.delete({
        where: { id: existingLike.id },
      });
      likeCount = Math.max(0, article.likeCount - 1);
    } else {
      // لایک جدید
      await prisma.articleLike.create({
        data: {
          articleId: article.id,
          userId: session.user.id,
        },
      });
      likeCount = article.likeCount + 1;
      isLiked = true;
    }

    // به‌روزرسانی تعداد لایک
    await prisma.article.update({
      where: { id: article.id },
      data: { likeCount },
    });

    return NextResponse.json({
      success: true,
      message: isLiked ? "مقاله لایک شد" : "لایک حذف شد",
      data: {
        likeCount,
        isLiked,
      },
    });
  } catch (error) {
    console.error("Error toggling article like:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ثبت لایک" },
      { status: 500 }
    );
  }
}

// GET - دریافت وضعیت لایک کاربر
export async function GET(request, { params }) {
  try {
    const session = await auth();
    const resolvedParams = params instanceof Promise ? await params : params;
    const { slug } = resolvedParams;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "شناسه مقاله الزامی است" },
        { status: 400 }
      );
    }

    // پیدا کردن مقاله
    const article = await prisma.article.findUnique({
      where: { slug },
      select: {
        id: true,
        likeCount: true,
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "مقاله یافت نشد" },
        { status: 404 }
      );
    }

    let isLiked = false;
    if (session?.user?.id) {
      const existingLike = await prisma.articleLike.findUnique({
        where: {
          articleId_userId: {
            articleId: article.id,
            userId: session.user.id,
          },
        },
      });
      isLiked = !!existingLike;
    }

    return NextResponse.json({
      success: true,
      data: {
        likeCount: article.likeCount,
        isLiked,
      },
    });
  } catch (error) {
    console.error("Error fetching article like status:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت وضعیت لایک" },
      { status: 500 }
    );
  }
}

