import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// POST - رای دادن به مفید/غیرمفید بودن یک نظر
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
    const { isHelpful } = body;

    if (typeof isHelpful !== "boolean") {
      return NextResponse.json(
        { success: false, error: "مقدار رای نامعتبر است" },
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

    // بررسی اینکه کاربر قبلاً رای داده است یا نه
    const existingVote = await prisma.reviewHelpful.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId: session.user.id,
        },
      },
    });

    let vote;
    let helpfulCount = review.helpfulCount;
    let unhelpfulCount = review.unhelpfulCount;

    if (existingVote) {
      // اگر قبلاً رای داده، رای قبلی را به‌روزرسانی کن
      if (existingVote.isHelpful !== isHelpful) {
        // اگر رای تغییر کرده، آمار را به‌روزرسانی کن
        if (isHelpful) {
          helpfulCount = review.helpfulCount + 1;
          unhelpfulCount = Math.max(0, review.unhelpfulCount - 1);
        } else {
          helpfulCount = Math.max(0, review.helpfulCount - 1);
          unhelpfulCount = review.unhelpfulCount + 1;
        }
      } else {
        // اگر همان رای را دوباره داده، رای را حذف کن
        if (isHelpful) {
          helpfulCount = Math.max(0, review.helpfulCount - 1);
        } else {
          unhelpfulCount = Math.max(0, review.unhelpfulCount - 1);
        }
        
        await prisma.reviewHelpful.delete({
          where: { id: existingVote.id },
        });

        await prisma.review.update({
          where: { id: reviewId },
          data: {
            helpfulCount,
            unhelpfulCount,
          },
        });

        return NextResponse.json({
          success: true,
          message: "رای شما حذف شد",
          data: {
            helpfulCount,
            unhelpfulCount,
            userVote: null,
          },
        });
      }

      vote = await prisma.reviewHelpful.update({
        where: { id: existingVote.id },
        data: { isHelpful },
      });
    } else {
      // رای جدید
      vote = await prisma.reviewHelpful.create({
        data: {
          reviewId,
          userId: session.user.id,
          isHelpful,
        },
      });

      if (isHelpful) {
        helpfulCount = review.helpfulCount + 1;
      } else {
        unhelpfulCount = review.unhelpfulCount + 1;
      }
    }

    // به‌روزرسانی آمار نظر
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        helpfulCount,
        unhelpfulCount,
      },
    });

    return NextResponse.json({
      success: true,
      message: isHelpful ? "نظر به عنوان مفید علامت‌گذاری شد" : "نظر به عنوان غیرمفید علامت‌گذاری شد",
      data: {
        helpfulCount,
        unhelpfulCount,
        userVote: isHelpful,
      },
    });
  } catch (error) {
    console.error("Error voting on review:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ثبت رای" },
      { status: 500 }
    );
  }
}

// GET - دریافت رای کاربر برای یک نظر
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({
        success: true,
        data: { userVote: null },
      });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { reviewId } = resolvedParams;

    const vote = await prisma.reviewHelpful.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        userVote: vote ? vote.isHelpful : null,
      },
    });
  } catch (error) {
    console.error("Error fetching user vote:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت رای" },
      { status: 500 }
    );
  }
}

