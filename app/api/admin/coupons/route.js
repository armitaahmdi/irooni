import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET - دریافت لیست کدهای تخفیف
export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where = {};

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { orders: true },
          },
        },
      }),
      prisma.coupon.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: coupons.map((coupon) => ({
        ...coupon,
        ordersCount: coupon._count.orders,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در دریافت کدهای تخفیف",
      },
      { status: 500 }
    );
  }
}

// POST - ایجاد کد تخفیف جدید
export async function POST(request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      code,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      usageLimit,
      isActive,
    } = body;

    // اعتبارسنجی
    if (!code || !discountType || !discountValue) {
      return NextResponse.json(
        {
          success: false,
          error: "لطفاً تمام فیلدهای الزامی را پر کنید",
        },
        { status: 400 }
      );
    }

    if (discountType === "percentage" && (discountValue < 1 || discountValue > 100)) {
      return NextResponse.json(
        {
          success: false,
          error: "درصد تخفیف باید بین 1 تا 100 باشد",
        },
        { status: 400 }
      );
    }

    if (discountType === "fixed" && discountValue < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "مبلغ تخفیف باید بیشتر از 0 باشد",
        },
        { status: 400 }
      );
    }

    // بررسی یکتایی کد
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (existingCoupon) {
      return NextResponse.json(
        {
          success: false,
          error: "این کد تخفیف قبلاً ثبت شده است",
        },
        { status: 400 }
      );
    }

    // ایجاد کد تخفیف
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        description: description?.trim() || null,
        discountType,
        discountValue,
        minPurchase: minPurchase || null,
        maxDiscount: discountType === "percentage" ? maxDiscount || null : null,
        usageLimit: usageLimit || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "کد تخفیف با موفقیت ایجاد شد",
      data: coupon,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در ایجاد کد تخفیف",
      },
      { status: 500 }
    );
  }
}

// PATCH - به‌روزرسانی کد تخفیف
export async function PATCH(request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "شناسه کد تخفیف الزامی است",
        },
        { status: 400 }
      );
    }

    // تبدیل کد به uppercase
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase().trim();
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "کد تخفیف با موفقیت به‌روزرسانی شد",
      data: coupon,
    });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در به‌روزرسانی کد تخفیف",
      },
      { status: 500 }
    );
  }
}

// DELETE - حذف کد تخفیف
export async function DELETE(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "شناسه کد تخفیف الزامی است",
        },
        { status: 400 }
      );
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "کد تخفیف با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در حذف کد تخفیف",
      },
      { status: 500 }
    );
  }
}

