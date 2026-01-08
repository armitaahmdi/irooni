import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - جستجوی سریع محصولات برای autocomplete
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "5");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const searchTerm = query.trim();

    // جستجو در نام و کد محصول
    let products = [];
    try {
      products = await prisma.product.findMany({
        where: {
          AND: [
            {
              OR: [
                { isVisible: true },
                { isVisible: null }  // برای محصولات قدیمی یا خالی
              ],
            },
          ],
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { code: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        price: true,
        discountPercent: true,
        category: {
          select: {
            slug: true,
          },
        },
        subcategory: {
          select: {
            slug: true,
          },
        },
        categoryLegacy: true,
        subcategoryLegacy: true,
      },
      take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.warn("Prisma query failed for product search, using empty array", error);
      products = []; // Fallback to empty array
    }

    // ساخت URL برای هر محصول
    const formattedProducts = products.map((product) => {
      const categorySlug = product.category?.slug || product.categoryLegacy;
      const subcategorySlug = product.subcategory?.slug || product.subcategoryLegacy;

      // پاک کردن پیشوند category از subcategory اگر وجود داشت
      const cleanSubcategorySlug =
        subcategorySlug && categorySlug && typeof subcategorySlug === "string"
          ? subcategorySlug.replace(`${categorySlug}-`, "")
          : subcategorySlug;

      let productUrl = "";
      if (categorySlug && cleanSubcategorySlug) {
        productUrl = `/${categorySlug}/${cleanSubcategorySlug}/${product.slug || product.id}`;
      } else if (categorySlug) {
        productUrl = `/${categorySlug}/${product.slug || product.id}`;
      } else {
        productUrl = `/product/${product.slug || product.id}`;
      }

      // محاسبه قیمت نهایی
      const finalPrice = product.discountPercent
        ? product.price * (1 - product.discountPercent / 100)
        : product.price;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        finalPrice: Math.round(finalPrice),
        discountPercent: product.discountPercent,
        url: productUrl,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedProducts,
    });
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در جستجو",
        data: [],
      },
      { status: 500 }
    );
  }
}
