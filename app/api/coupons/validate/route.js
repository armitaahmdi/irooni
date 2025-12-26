import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// POST - اعتبارسنجی و اعمال کد تخفیف
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code, totalAmount } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: "کد تخفیف الزامی است" },
        { status: 400 }
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "مبلغ سبد خرید نامعتبر است" },
        { status: 400 }
      );
    }

    // پیدا کردن کد تخفیف
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "کد تخفیف معتبر نیست" },
        { status: 404 }
      );
    }

    // بررسی فعال بودن
    if (!coupon.isActive) {
      return NextResponse.json(
        { success: false, error: "این کد تخفیف غیرفعال است" },
        { status: 400 }
      );
    }


    // بررسی حداقل مبلغ خرید
    if (coupon.minPurchase && totalAmount < coupon.minPurchase) {
      return NextResponse.json(
        {
          success: false,
          error: `حداقل مبلغ خرید برای این کد تخفیف ${new Intl.NumberFormat("fa-IR").format(coupon.minPurchase)} تومان است`,
        },
        { status: 400 }
      );
    }

    // بررسی تعداد استفاده
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: "تعداد استفاده از این کد تخفیف به پایان رسیده است" },
        { status: 400 }
      );
    }

    // محاسبه تخفیف
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((totalAmount * coupon.discountValue) / 100);
      // اعمال حداکثر تخفیف در صورت وجود
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;
      // تخفیف نباید بیشتر از مبلغ کل باشد
      if (discountAmount > totalAmount) {
        discountAmount = totalAmount;
      }
    }

    const finalAmount = totalAmount - discountAmount;

    return NextResponse.json({
      success: true,
      data: {
        couponId: coupon.id,
        couponCode: coupon.code,
        discountAmount,
        finalAmount,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { success: false, error: "خطا در اعتبارسنجی کد تخفیف" },
      { status: 500 }
    );
  }
}
