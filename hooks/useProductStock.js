import { useState, useEffect } from "react";

/**
 * Hook for managing product stock calculations and real-time stock fetching
 */
export function useProductStock(product, cartItems, selectedSize, selectedColor) {
  const [realTimeStock, setRealTimeStock] = useState({});

  // دریافت موجودی real-time از API
  const fetchRealTimeStock = async (size, color, variantId) => {
    if (!product) return 0;

    try {
      const params = new URLSearchParams();
      
      // اگر variantId داریم، از آن استفاده می‌کنیم
      if (variantId) {
        params.append("variantId", variantId);
      } else if (size && color) {
        // اگر variantId نداریم اما size و color داریم
        params.append("size", size);
        params.append("color", color);
        // اگر productId داریم، آن را هم اضافه می‌کنیم
        if (product.id) {
          params.append("productId", product.id);
        }
      } else {
        // اگر هیچکدام نداریم، نمی‌توانیم موجودی را دریافت کنیم
        return 0;
      }

      const response = await fetch(`/api/products/stock?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        const stock = data.data.availableStock || 0;
        const variantKey = variantId || `${size}-${color}`;
        setRealTimeStock((prev) => ({
          ...prev,
          [variantKey]: stock,
        }));
        return stock;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching real-time stock:", error);
      return 0;
    }
  };

  // محاسبه موجودی برای یک سایز و رنگ خاص
  const getAvailableStockForSizeColor = (size, color) => {
    if (!product || !size || !color) return 0;

    // اگر variantها وجود دارند، از آن‌ها استفاده کن
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants.find((v) => v.size === size && v.color === color);
      if (variant) {
        const cartQuantity = cartItems
          .filter((item) => item.variant?.id === variant.id)
          .reduce((sum, item) => sum + item.quantity, 0);
        return Math.max(0, variant.stock - cartQuantity);
      }
    }

    // اگر variantها وجود ندارند، از sizeStock استفاده کن (backward compatibility)
    let totalStock = product.stock || 0;

    if (product.sizeStock) {
      try {
        const sizeStockObj =
          typeof product.sizeStock === "string"
            ? JSON.parse(product.sizeStock)
            : product.sizeStock;

        if (sizeStockObj && typeof sizeStockObj === "object") {
          // ساختار جدید: {"S": {"قرمز": 3, "آبی": 2}}
          if (sizeStockObj[size] && typeof sizeStockObj[size] === "object") {
            totalStock = Object.values(sizeStockObj[size]).reduce(
              (sum, val) => sum + (Number(val) || 0),
              0
            );
          }
          // ساختار قدیمی: {"S": 5}
          else if (
            sizeStockObj[size] !== undefined &&
            typeof sizeStockObj[size] === "number"
          ) {
            totalStock = sizeStockObj[size];
          }
        }
      } catch (e) {
        console.log("Error parsing sizeStock:", e);
      }
    }

    return Math.floor(totalStock);
  };

  // محاسبه موجودی برای یک سایز (همه رنگ‌ها)
  const getAvailableStockForSize = (size) => {
    if (!product || !size) return 0;

    // اگر variantها وجود دارند
    if (product.variants && product.variants.length > 0) {
      const variantsForSize = product.variants.filter((v) => v.size === size);
      let totalStock = 0;

      for (const variant of variantsForSize) {
        const cartQuantity = cartItems
          .filter((item) => item.variant?.id === variant.id)
          .reduce((sum, item) => sum + item.quantity, 0);
        totalStock += Math.max(0, variant.stock - cartQuantity);
      }

      return Math.floor(totalStock);
    }

    // اگر variantها وجود ندارند، از sizeStock استفاده کن
    let totalStock = product.stock || 0;

    if (size && product.sizeStock) {
      try {
        const sizeStockObj =
          typeof product.sizeStock === "string"
            ? JSON.parse(product.sizeStock)
            : product.sizeStock;

        if (sizeStockObj && typeof sizeStockObj === "object") {
          if (sizeStockObj[size] && typeof sizeStockObj[size] === "object") {
            totalStock = Object.values(sizeStockObj[size]).reduce(
              (sum, val) => sum + (Number(val) || 0),
              0
            );
          } else if (
            sizeStockObj[size] !== undefined &&
            typeof sizeStockObj[size] === "number"
          ) {
            totalStock = sizeStockObj[size];
          }
        }
      } catch (e) {
        console.log("Error parsing sizeStock:", e);
      }
    }

    return Math.floor(totalStock);
  };

  // محاسبه موجودی برای یک رنگ (همه سایزها)
  const getAvailableStockForColor = (color) => {
    if (!product || !color) return 0;

    // اگر variantها وجود دارند
    if (product.variants && product.variants.length > 0) {
      const variantsForColor = product.variants.filter((v) => v.color === color);
      let totalStock = 0;

      for (const variant of variantsForColor) {
        const cartQuantity = cartItems
          .filter((item) => item.variant?.id === variant.id)
          .reduce((sum, item) => sum + item.quantity, 0);
        totalStock += Math.max(0, variant.stock - cartQuantity);
      }

      return Math.floor(totalStock);
    }

    // اگر variantها وجود ندارند، از sizeStock استفاده کن
    let totalStock = 0;

    if (product.sizeStock) {
      try {
        const sizeStockObj =
          typeof product.sizeStock === "string"
            ? JSON.parse(product.sizeStock)
            : product.sizeStock;

        if (sizeStockObj && typeof sizeStockObj === "object") {
          for (const [size, sizeData] of Object.entries(sizeStockObj)) {
            if (sizeData && typeof sizeData === "object" && sizeData[color] !== undefined) {
              totalStock += Number(sizeData[color]) || 0;
            }
          }
        }
      } catch (e) {
        console.log("Error parsing sizeStock:", e);
      }
    }

    return Math.floor(totalStock);
  };

  // محاسبه موجودی کلی محصول
  const getTotalAvailableStock = () => {
    if (!product) return 0;

    // اگر variantها وجود دارند
    if (product.variants && product.variants.length > 0) {
      let totalStock = 0;
      for (const variant of product.variants) {
        const cartQuantity = cartItems
          .filter((item) => item.variant?.id === variant.id)
          .reduce((sum, item) => sum + item.quantity, 0);
        totalStock += Math.max(0, variant.stock - cartQuantity);
      }
      return Math.floor(totalStock);
    }

    // اگر sizeStock وجود دارد
    if (product.sizeStock && product.sizes && product.sizes.length > 0) {
      try {
        const sizeStockObj =
          typeof product.sizeStock === "string"
            ? JSON.parse(product.sizeStock)
            : product.sizeStock;

        if (sizeStockObj && typeof sizeStockObj === "object") {
          let totalStock = 0;
          for (const size of product.sizes) {
            if (sizeStockObj[size] !== undefined) {
              const sizeStockValue = sizeStockObj[size];
              if (sizeStockValue !== null && sizeStockValue !== undefined) {
                if (typeof sizeStockValue === "object") {
                  totalStock += Object.values(sizeStockValue).reduce(
                    (sum, val) => sum + (Number(val) || 0),
                    0
                  );
                } else {
                  totalStock += Number(sizeStockValue) || 0;
                }
              }
            }
          }

          const totalCartQuantity = cartItems
            .filter((item) => item.product.id === product.id)
            .reduce((sum, item) => sum + item.quantity, 0);

          return Math.floor(Math.max(0, totalStock - totalCartQuantity));
        }
      } catch (e) {
        console.log("Error parsing sizeStock:", e);
      }
    }

    // محاسبه از stock کلی
    const totalCartQuantity = cartItems
      .filter((item) => item.product.id === product.id)
      .reduce((sum, item) => sum + item.quantity, 0);

    return Math.floor(Math.max(0, (product.stock || 0) - totalCartQuantity));
  };

  // بررسی کامل اتمام موجودی
  const checkCompletelyOutOfStock = () => {
    if (!product) return true;

    if (product.inStock === false) return true;

    const totalAvailableStock = getTotalAvailableStock();
    if (totalAvailableStock <= 0) return true;

    if (product.sizeStock && product.sizes && product.sizes.length > 0) {
      try {
        const sizeStockObj =
          typeof product.sizeStock === "string"
            ? JSON.parse(product.sizeStock)
            : product.sizeStock;

        if (sizeStockObj && typeof sizeStockObj === "object") {
          const allSizesEmpty = product.sizes.every((size) => {
            const sizeStock = sizeStockObj[size];
            if (!sizeStock) return true;

            if (typeof sizeStock === "object") {
              const totalColorStock = Object.values(sizeStock).reduce(
                (sum, val) => sum + (Number(val) || 0),
                0
              );
              return totalColorStock <= 0;
            }

            return Number(sizeStock) <= 0;
          });

          if (allSizesEmpty) return true;
        }
      } catch (e) {
        console.log("Error checking stock:", e);
      }
    }

    return false;
  };

  // به‌روزرسانی موجودی real-time وقتی سایز یا رنگ تغییر می‌کند
  useEffect(() => {
    if (product && selectedSize && selectedColor) {
      const variant = product.variants?.find(
        (v) => v.size === selectedSize && v.color === selectedColor
      );
      if (variant) {
        fetchRealTimeStock(selectedSize, selectedColor, variant.id);
      } else {
        fetchRealTimeStock(selectedSize, selectedColor, null);
      }
    }
  }, [selectedSize, selectedColor, product, cartItems]);

  return {
    realTimeStock,
    fetchRealTimeStock,
    getAvailableStockForSizeColor,
    getAvailableStockForSize,
    getAvailableStockForColor,
    getTotalAvailableStock,
    checkCompletelyOutOfStock,
  };
}

