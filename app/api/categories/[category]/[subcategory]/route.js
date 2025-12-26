import { NextResponse } from "next/server";
import { getSubcategoryBySlugs } from "@/lib/api/categories";

export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { category, subcategory } = resolvedParams;

    if (!category || !subcategory) {
      return NextResponse.json(
        { success: false, error: "Category یا subcategory ارسال نشده است" },
        { status: 400 }
      );
    }

    const subcategoryData = await getSubcategoryBySlugs(category, subcategory);

    if (!subcategoryData) {
      return NextResponse.json(
        { success: false, error: "زیردسته یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subcategoryData,
    });
  } catch (error) {
    console.error("Error in GET /api/categories/[category]/[subcategory]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در دریافت زیردسته",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

