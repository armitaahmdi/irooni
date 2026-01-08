import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * API endpoint برای دریافت موجودی real-time یک محصول
 * این endpoint موجودی را با در نظر گرفتن همه سبدهای خرید محاسبه می‌کند
 * 
 * GET /api/products/[id]/stock?size=S&color=قرمز
 */
export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id: productId } = resolvedParams; // استفاده از id به جای productId
    const { searchParams } = new URL(request.url);
    const size = searchParams.get("size");
    const color = searchParams.get("color");
    const variantId = searchParams.get("variantId");

    if (!productId) {
      return NextResponse.json(
        { error: "شناسه محصول الزامی است" },
        { status: 400 }
      );
    }

    // دریافت محصول
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "محصول یافت نشد" },
        { status: 404 }
      );
    }

    let baseStock = product.stock || 0;
    let variant = null;

    // اگر variantId داده شده، از variant استفاده کن
    if (variantId) {
      variant = product.variants?.find(v => v.id === variantId);
      if (variant) {
        baseStock = variant.stock || 0;
      }
    }
    // اگر size و color داده شده، variant را پیدا کن
    else if (size && color && product.variants) {
      variant = product.variants.find(v => v.size === size && v.color === color);
      if (variant) {
        baseStock = variant.stock || 0;
      }
    }
    // اگر variant وجود ندارد اما sizeStock وجود دارد
    else if (size && color && product.sizeStock) {
      try {
        const sizeStockObj = typeof product.sizeStock === 'string' 
          ? JSON.parse(product.sizeStock) 
          : product.sizeStock;
        
        if (sizeStockObj && typeof sizeStockObj === 'object') {
          if (sizeStockObj[size] && typeof sizeStockObj[size] === 'object') {
            const colorStock = sizeStockObj[size][color];
            if (colorStock !== null && colorStock !== undefined) {
              baseStock = Number(colorStock) || 0;
            }
          }
        }
      } catch (e) {
        console.log("Error parsing sizeStock:", e);
      }
    }

    // پیدا کردن تعداد در همه سبدهای خرید (real-time)
    let cartQuantity = 0;
    if (variant) {
      const cartItems = await prisma.cartItem.findMany({
        where: {
          variantId: variant.id,
        },
      });
      cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    } else if (size && color) {
      const cartItems = await prisma.cartItem.findMany({
        where: {
          productId: productId,
          size: size,
          color: color,
        },
      });
      cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    } else {
      // اگر size و color داده نشده، تعداد کل محصول در همه سبدهای خرید
      const cartItems = await prisma.cartItem.findMany({
        where: {
          productId: productId,
        },
      });
      cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }

    // موجودی واقعی = موجودی پایه - تعداد در همه سبدهای خرید
    const availableStock = Math.max(0, baseStock - cartQuantity);

    return NextResponse.json({
      success: true,
      data: {
        baseStock,
        cartQuantity,
        availableStock,
        variant: variant ? {
          id: variant.id,
          size: variant.size,
          color: variant.color,
        } : null,
      },
    });
  } catch (error) {
    console.error("Error fetching stock:", error);
    return NextResponse.json(
      { error: "خطا در دریافت موجودی" },
      { status: 500 }
    );
  }
}

