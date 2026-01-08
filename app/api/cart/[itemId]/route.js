import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PUT - به‌روزرسانی آیتم سبد خرید
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { itemId } = resolvedParams;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "تعداد باید حداقل 1 باشد" },
        { status: 400 }
      );
    }

    // دریافت آیتم سبد خرید
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
        variant: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "آیتم یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی اینکه سبد خرید متعلق به کاربر است
    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    // بررسی موجودی - منطق حرفه‌ای: استفاده از ProductVariant
    let baseStock = cartItem.product.stock || 0;
    
    // اگر variantId وجود دارد، از variant استفاده کن
    if (cartItem.variantId && cartItem.variant) {
      baseStock = cartItem.variant.stock || 0;
    }
    // اگر variantId وجود ندارد، از sizeStock استفاده کن (backward compatibility)
    else if (cartItem.size && cartItem.color && cartItem.product.sizeStock) {
      try {
        const sizeStockObj = typeof cartItem.product.sizeStock === 'string' 
          ? JSON.parse(cartItem.product.sizeStock) 
          : cartItem.product.sizeStock;
        
        if (sizeStockObj && typeof sizeStockObj === 'object') {
          if (sizeStockObj[cartItem.size] && typeof sizeStockObj[cartItem.size] === 'object') {
            const colorStock = sizeStockObj[cartItem.size][cartItem.color];
            if (colorStock !== null && colorStock !== undefined) {
              baseStock = Number(colorStock) || 0;
            }
          }
          else if (sizeStockObj[cartItem.size] !== undefined && typeof sizeStockObj[cartItem.size] === 'number') {
            baseStock = sizeStockObj[cartItem.size];
          }
        }
      } catch (e) {
        console.log("Error parsing sizeStock:", e);
      }
    }
    
    // پیدا کردن تعداد این variant یا size+color در همه سبدهای خرید - بدون در نظر گرفتن آیتم فعلی (real-time)
    let cartItemsForVariant = [];
    if (cartItem.variantId) {
      cartItemsForVariant = await prisma.cartItem.findMany({
        where: {
          variantId: cartItem.variantId, // همه سبدهای خرید، نه فقط کاربر فعلی
          NOT: {
            id: itemId, // آیتم فعلی را در نظر نگیر
          },
        },
      });
    } else {
      cartItemsForVariant = await prisma.cartItem.findMany({
        where: {
          productId: cartItem.productId,
          size: cartItem.size || null,
          color: cartItem.color || null,
          NOT: {
            id: itemId, // آیتم فعلی را در نظر نگیر
          },
        },
      });
    }
    const cartQuantityForVariant = cartItemsForVariant.reduce((sum, item) => sum + item.quantity, 0);
    
    // موجودی واقعی = موجودی پایه - تعداد در همه سبدهای خرید (بدون آیتم فعلی)
    const availableStock = Math.max(0, baseStock - cartQuantityForVariant);
    
    if (quantity > availableStock) {
      const variantInfo = cartItem.variant
        ? `سایز ${cartItem.variant.size} و رنگ ${cartItem.variant.color}`
        : cartItem.size && cartItem.color
        ? `سایز ${cartItem.size} و رنگ ${cartItem.color}`
        : cartItem.size
        ? `سایز ${cartItem.size}`
        : 'محصول';
      return NextResponse.json(
        { error: `موجودی ${variantInfo} کافی نیست. موجودی: ${availableStock}` },
        { status: 400 }
      );
    }

    // به‌روزرسانی
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            categoryLegacy: true,
            subcategoryLegacy: true,
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
            image: true,
            price: true,
            discountPercent: true,
            stock: true,
            sizeStock: true,
            inStock: true,
            sizes: true,
            colors: true,
          },
        },
          variant: {
            select: {
              id: true,
              color: true,
              size: true,
              price: true,
              stock: true,
              image: true,
            },
          },
      },
    });

    return NextResponse.json({
      success: true,
      message: "سبد خرید به‌روزرسانی شد",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی سبد خرید" },
      { status: 500 }
    );
  }
}

// DELETE - حذف آیتم از سبد خرید
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { itemId } = resolvedParams;

    // دریافت آیتم سبد خرید
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "آیتم یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی اینکه سبد خرید متعلق به کاربر است
    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    // حذف
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({
      success: true,
      message: "آیتم از سبد خرید حذف شد",
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { error: "خطا در حذف از سبد خرید" },
      { status: 500 }
    );
  }
}



