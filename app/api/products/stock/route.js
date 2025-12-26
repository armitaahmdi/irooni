import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * API endpoint برای دریافت موجودی real-time یک محصول
 * این endpoint موجودی را با در نظر گرفتن همه سبدهای خرید محاسبه می‌کند
 * 
 * GET /api/products/stock?size=S&color=قرمز&variantId=xxx
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const size = searchParams.get("size");
    const color = searchParams.get("color");
    const variantId = searchParams.get("variantId");

    // اگر variantId داده شده، از آن استفاده کن
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
        include: {
          product: true,
        },
      });

      if (!variant) {
        return NextResponse.json(
          { success: false, error: "ورینت یافت نشد" },
          { status: 404 }
        );
      }

      const baseStock = variant.stock || 0;

      // پیدا کردن تعداد در همه سبدهای خرید (real-time)
      const cartItems = await prisma.cartItem.findMany({
        where: {
          variantId: variant.id,
        },
      });
      const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

      // موجودی واقعی = موجودی پایه - تعداد در همه سبدهای خرید
      const availableStock = Math.max(0, baseStock - cartQuantity);

      return NextResponse.json({
        success: true,
        data: {
          baseStock,
          cartQuantity,
          availableStock,
          variant: {
            id: variant.id,
            size: variant.size,
            color: variant.color,
          },
        },
      });
    }

    // اگر size و color داده شده اما variantId داده نشده
    if (size && color) {
      const productId = searchParams.get("productId");
      
      // اگر productId داده شده، ابتدا محصول را پیدا کن
      if (productId) {
        const product = await prisma.product.findUnique({
          where: { id: productId },
          include: {
            variants: true,
          },
        });

        if (!product) {
          return NextResponse.json(
            { success: false, error: "محصول یافت نشد" },
            { status: 404 }
          );
        }

        // پیدا کردن variant بر اساس size و color
        const variant = product.variants?.find(
          (v) => v.size === size && v.color === color
        );

        if (variant) {
          const baseStock = variant.stock || 0;

          // پیدا کردن تعداد در همه سبدهای خرید (real-time)
          const cartItems = await prisma.cartItem.findMany({
            where: {
              variantId: variant.id,
            },
          });
          const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

          // موجودی واقعی = موجودی پایه - تعداد در همه سبدهای خرید
          const availableStock = Math.max(0, baseStock - cartQuantity);

          return NextResponse.json({
            success: true,
            data: {
              baseStock,
              cartQuantity,
              availableStock,
              variant: {
                id: variant.id,
                size: variant.size,
                color: variant.color,
              },
            },
          });
        }

        // اگر variant پیدا نشد، از sizeStock استفاده کن
        let baseStock = product.stock || 0;
        if (product.sizeStock) {
          try {
            const sizeStockObj =
              typeof product.sizeStock === "string"
                ? JSON.parse(product.sizeStock)
                : product.sizeStock;

            if (sizeStockObj && typeof sizeStockObj === "object") {
              if (sizeStockObj[size] && typeof sizeStockObj[size] === "object") {
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
        const cartItems = await prisma.cartItem.findMany({
          where: {
            productId: productId,
            size: size,
            color: color,
          },
        });
        const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        // موجودی واقعی = موجودی پایه - تعداد در همه سبدهای خرید
        const availableStock = Math.max(0, baseStock - cartQuantity);

        return NextResponse.json({
          success: true,
          data: {
            baseStock,
            cartQuantity,
            availableStock,
            variant: null,
          },
        });
      }

      // اگر productId داده نشده، سعی کن variant را پیدا کن
      const variant = await prisma.productVariant.findFirst({
        where: {
          size: size,
          color: color,
        },
        include: {
          product: true,
        },
      });

      if (variant) {
        const baseStock = variant.stock || 0;

        // پیدا کردن تعداد در همه سبدهای خرید (real-time)
        const cartItems = await prisma.cartItem.findMany({
          where: {
            variantId: variant.id,
          },
        });
        const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        // موجودی واقعی = موجودی پایه - تعداد در همه سبدهای خرید
        const availableStock = Math.max(0, baseStock - cartQuantity);

        return NextResponse.json({
          success: true,
          data: {
            baseStock,
            cartQuantity,
            availableStock,
            variant: {
              id: variant.id,
              size: variant.size,
              color: variant.color,
            },
          },
        });
      }

      // اگر variant پیدا نشد
      return NextResponse.json(
        { success: false, error: "ورینت یافت نشد" },
        { status: 404 }
      );
    }

    // اگر هیچ پارامتری داده نشده
    return NextResponse.json(
      { success: false, error: "حداقل یکی از پارامترهای variantId یا size+color الزامی است" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching stock:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت موجودی" },
      { status: 500 }
    );
  }
}

