import { NextResponse } from "next/server";
import { getCategoryBySlug } from "@/lib/api/categories";

export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { category } = resolvedParams;

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Slug ارسال نشده است" },
        { status: 400 }
      );
    }

    const categoryData = await getCategoryBySlug(category);

    if (!categoryData) {
      return NextResponse.json(
        { success: false, error: "دسته‌بندی یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: categoryData,
    });
  } catch (error) {
    console.error("Error in GET /api/categories/[category]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در دریافت دسته‌بندی",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}



