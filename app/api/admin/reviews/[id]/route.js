import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// PATCH - به‌روزرسانی وضعیت نظر (تایید/رد)
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const body = await request.json();
    const { isApproved } = body;

    if (typeof isApproved !== "boolean") {
      return NextResponse.json(
        { success: false, error: "وضعیت تایید الزامی است" },
        { status: 400 }
      );
    }

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        product: {
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
      message: isApproved ? "نظر با موفقیت تایید شد" : "نظر رد شد",
      data: review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { success: false, error: "خطا در به‌روزرسانی نظر" },
      { status: 500 }
    );
  }
}

// DELETE - حذف نظر
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "نظر با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { success: false, error: "خطا در حذف نظر" },
      { status: 500 }
    );
  }
}

