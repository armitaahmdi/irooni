import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - دریافت سبد خرید کاربر
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    // دریافت یا ایجاد سبد خرید
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
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
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // اگر سبد خرید وجود ندارد، ایجاد کن
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
        include: {
          items: {
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
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }

    // محاسبه مبلغ کل
    const total = cart.items.reduce((sum, item) => {
      const price = item.product.discountPercent
        ? item.product.price * (1 - item.product.discountPercent / 100)
        : item.product.price;
      return sum + price * item.quantity;
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        ...cart,
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سبد خرید" },
      { status: 500 }
    );
  }
}

// POST - افزودن محصول به سبد خرید
export async function POST(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity = 1, size, color, variantId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "شناسه محصول الزامی است" },
        { status: 400 }
      );
    }

    // بررسی وجود محصول
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "محصول یافت نشد" },
        { status: 404 }
      );
    }

    // دریافت یا ایجاد سبد خرید
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
      });
    }

    // بررسی موجودی - منطق حرفه‌ای: استفاده از ProductVariant
    let baseStock = product.stock || 0;
    let variant = null;
    
    // اگر variantId داده شده، از variant استفاده کن
    if (variantId) {
      variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
      });
      
      if (!variant) {
        return NextResponse.json(
          { error: "ورینت یافت نشد" },
          { status: 404 }
        );
      }
      
      if (variant.productId !== productId) {
        return NextResponse.json(
          { error: "ورینت متعلق به این محصول نیست" },
          { status: 400 }
        );
      }
      
      baseStock = variant.stock || 0;
    }
    // اگر variantId داده نشده، از sizeStock استفاده کن (backward compatibility)
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
          else if (sizeStockObj[size] !== undefined && typeof sizeStockObj[size] === 'number') {
            baseStock = sizeStockObj[size];
          }
        }
      } catch (e) {
        console.log("Error parsing sizeStock:", e);
      }
    }
    
    // پیدا کردن تعداد این variant یا size+color در همه سبدهای خرید (real-time)
    // این مهم است: موجودی باید از همه سبدهای خرید کم شود، نه فقط سبد خرید کاربر فعلی
    let cartItemsForVariant = [];
    if (variantId) {
      cartItemsForVariant = await prisma.cartItem.findMany({
        where: {
          variantId: variantId, // همه سبدهای خرید، نه فقط کاربر فعلی
        },
      });
    } else {
      cartItemsForVariant = await prisma.cartItem.findMany({
        where: {
          productId: productId,
          size: size || null,
          color: color || null,
        },
      });
    }
    const cartQuantityForVariant = cartItemsForVariant.reduce((sum, item) => sum + item.quantity, 0);
    
    // بررسی اینکه آیا این محصول با همین variant یا size+color قبلاً در سبد خرید وجود دارد
    const existingItem = await prisma.cartItem.findFirst({
      where: variantId
        ? {
            cartId: cart.id,
            variantId: variantId,
          }
        : {
            cartId: cart.id,
            productId,
            size: size || null,
            color: color || null,
          },
    });

    if (existingItem) {
      // اگر وجود دارد، تعداد را افزایش بده
      const newQuantity = existingItem.quantity + quantity;
      
      // موجودی واقعی = موجودی پایه - تعداد در همه سبدهای خرید (بدون آیتم فعلی)
      // cartQuantityForVariant شامل همه سبدهای خرید است، پس باید existingItem.quantity را کم کنیم
      const availableStock = Math.max(0, baseStock - (cartQuantityForVariant - existingItem.quantity));
      
      if (newQuantity > availableStock) {
        const variantInfo = variant 
          ? `سایز ${variant.size} و رنگ ${variant.color}`
          : size && color 
          ? `سایز ${size} و رنگ ${color}` 
          : size 
          ? `سایز ${size}` 
          : 'محصول';
        return NextResponse.json(
          { error: `موجودی ${variantInfo} کافی نیست. موجودی: ${availableStock}` },
          { status: 400 }
        );
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
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
        },
      });

      return NextResponse.json({
        success: true,
        message: "محصول به سبد خرید اضافه شد",
        data: updatedItem,
      });
    } else {
      // اگر وجود ندارد، ابتدا موجودی را چک کن
      const availableStock = Math.max(0, baseStock - cartQuantityForVariant);
      
      if (availableStock < quantity) {
        const variantInfo = variant 
          ? `سایز ${variant.size} و رنگ ${variant.color}`
          : size && color 
          ? `سایز ${size} و رنگ ${color}` 
          : size 
          ? `سایز ${size}` 
          : 'محصول';
        return NextResponse.json(
          { error: `موجودی ${variantInfo} کافی نیست. موجودی: ${availableStock}` },
          { status: 400 }
        );
      }
      
      // اگر موجودی کافی است، آیتم جدید اضافه کن
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
          size: size || null,
          color: color || null,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              category: true,
              subcategory: true,
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
        },
      });

      return NextResponse.json({
        success: true,
        message: "محصول به سبد خرید اضافه شد",
        data: newItem,
      }, { status: 201 });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "خطا در افزودن به سبد خرید" },
      { status: 500 }
    );
  }
}



