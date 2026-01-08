import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - دریافت آمار نظرات یک محصول
export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const productId = resolvedParams.id;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "شناسه محصول الزامی است" },
        { status: 400 }
      );
    }

    // دریافت تمام نظرات تایید شده
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      select: {
        rating: true,
      },
    });

    // محاسبه آمار
    const totalRatings = reviews.length;
    const averageRating =
      totalRatings > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings
        : 0;

    // توزیع امتیازها
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingDistribution[review.rating]++;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10, // رند به یک رقم اعشار
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching review stats:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت آمار نظرات" },
      { status: 500 }
    );
  }
}
