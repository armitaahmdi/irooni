import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/api/categories";

export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { productSlug } = resolvedParams;

    if (!productSlug) {
      return NextResponse.json(
        { success: false, error: "Product slug ارسال نشده است" },
        { status: 400 }
      );
    }

    const product = await getProductBySlug(productSlug);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "محصول یافت نشد" },
        { status: 404 }
      );
    }

    // محاسبه قیمت نهایی با تخفیف
    const finalPrice = product.discountPercent
      ? Math.round(product.price * (1 - product.discountPercent / 100))
      : product.price;

    // فرمت محصول
    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      code: product.code,
      category: product.category?.slug || null,
      categoryId: product.categoryId,
      subcategory: product.subcategory?.slug || null,
      subcategoryId: product.subcategoryId,
      image: product.image,
      images: product.images,
      price: finalPrice,
      originalPrice: product.discountPercent ? product.price : null,
      discountPercent: product.discountPercent,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock,
      sizeStock: product.sizeStock || {}, // برای backward compatibility
      variants: product.variants || [], // ورینت‌های محصول
      inStock: product.inStock,
      material: product.material,
      description: product.description,
      features: product.features,
      sizeChart: product.sizeChart,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: formattedProduct,
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در دریافت محصول",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

