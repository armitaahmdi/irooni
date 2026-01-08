import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET - دریافت نظرات یک محصول
export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const productId = resolvedParams.id;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // دریافت نظرات تایید شده
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId,
          isApproved: true,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          replies: {
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
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: {
          productId,
          isApproved: true,
        },
      }),
    ]);

    // محاسبه آمار نظرات
    const stats = await prisma.review.groupBy({
      by: ["rating"],
      where: {
        productId,
        isApproved: true,
      },
      _count: {
        rating: true,
      },
    });

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    stats.forEach((stat) => {
      ratingDistribution[stat.rating] = stat._count.rating;
    });

    const totalRatings = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);
    const averageRating =
      totalRatings > 0
        ? stats.reduce((sum, stat) => sum + stat.rating * stat._count.rating, 0) / totalRatings
        : 0;

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در دریافت نظرات",
      },
      { status: 500 }
    );
  }
}

// POST - ثبت نظر جدید
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "لطفاً ابتدا وارد شوید",
        },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const productId = resolvedParams.id;

    const body = await request.json();
    const { rating, title, comment } = body;

    // اعتبارسنجی
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          error: "امتیاز باید بین 1 تا 5 باشد",
        },
        { status: 400 }
      );
    }

    // بررسی اینکه آیا کاربر قبلاً نظر داده است
    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId: session.user.id,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          error: "شما قبلاً برای این محصول نظر داده‌اید",
        },
        { status: 400 }
      );
    }

    // بررسی اینکه آیا کاربر این محصول را خریده است (برای verified purchase)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          paymentStatus: "paid",
        },
      },
    });

    // ایجاد نظر
    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        title: title?.trim() || null,
        comment: comment?.trim() || null,
        isVerifiedPurchase: !!hasPurchased,
        isApproved: false, // نیاز به تایید ادمین
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
      message: "نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود",
      data: review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در ثبت نظر",
      },
      { status: 500 }
    );
  }
}


