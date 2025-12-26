import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - دریافت یک محصول خاص
export async function GET(request, { params }) {
  try {
    // بررسی Prisma Client
    if (!prisma || !prisma.product) {
      console.error("Prisma client is not properly initialized");
      return NextResponse.json(
        { 
          success: false,
          error: "خطا در اتصال به دیتابیس. لطفاً سرور را restart کنید."
        },
        { status: 500 }
      );
    }

    // در Next.js 15+ params باید await شود
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "شناسه محصول ارسال نشده است" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { 
          success: false,
          error: "محصول یافت نشد" 
        },
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
      code: product.code,
      category: product.category,
      subcategory: product.subcategory,
      image: product.image,
      images: product.images,
      price: finalPrice,
      originalPrice: product.discountPercent ? product.price : null,
      discountPercent: product.discountPercent,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock,
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
    console.error("Error fetching product:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    
    let errorMessage = "خطا در دریافت محصول";
    if (error.message?.includes("findUnique") || error.message?.includes("findMany")) {
      errorMessage = "خطا در اتصال به دیتابیس. لطفاً Prisma Client را generate کنید.";
    } else if (error.message) {
      errorMessage = `خطا: ${error.message}`;
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}


