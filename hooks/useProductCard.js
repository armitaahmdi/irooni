import { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite, selectIsFavorite } from "@/store/slices/favoritesSlice";
import { addToCart, updateCartItem, removeFromCart } from "@/store/slices/cartSlice";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * Calculate available stock for a product
 */
const getAvailableStock = (product, cartItems) => {
  // If variants exist, use them
  if (product.variants && product.variants.length > 0) {
    let totalStock = 0;
    for (const variant of product.variants) {
      const cartQuantity = cartItems
        .filter((item) => item.variant?.id === variant.id)
        .reduce((sum, item) => sum + item.quantity, 0);
      totalStock += Math.max(0, variant.stock - cartQuantity);
    }
    return totalStock;
  }

  // If sizeStock exists, use it
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

        return Math.max(0, totalStock - totalCartQuantity);
      }
    } catch (e) {
      console.log("Error parsing sizeStock:", e);
    }
  }

  // Use general stock
  const baseStock = product.stock || 0;
  const totalCartQuantity = cartItems
    .filter((item) => item.product.id === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  return Math.max(0, baseStock - totalCartQuantity);
};

/**
 * Check if product is completely out of stock
 */
const checkCompletelyOutOfStock = (product, availableStock) => {
  if (product.inStock === false) return true;
  if (availableStock <= 0) return true;

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

/**
 * Hook for managing ProductCard state and logic
 */
export function useProductCard(product) {
  const dispatch = useAppDispatch();
  const isLiked = useAppSelector((state) => selectIsFavorite(state, product.id));
  const cartItems = useAppSelector((state) => state.cart.items);
  const { showToast } = useToast();
  const isProcessingRef = useRef(false);
  const [isCartProcessing, setIsCartProcessing] = useState(false);

  // Find product in cart
  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const cartQuantity = cartItem?.quantity || 0;
  const isInCart = cartQuantity > 0;

  // Calculate available stock
  const availableStock = getAvailableStock(product, cartItems);
  const isOutOfStock = checkCompletelyOutOfStock(product, availableStock);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    const wasLiked = isLiked;
    dispatch(toggleFavorite(product.id));

    if (!wasLiked) {
      showToast("محصول به لیست علاقه‌مندی‌ها اضافه شد", "success");
    } else {
      showToast("محصول از لیست علاقه‌مندی‌ها حذف شد", "success");
    }

    setTimeout(() => {
      isProcessingRef.current = false;
    }, 500);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCartProcessing) return;

    if (availableStock < 1) {
      showToast("این محصول در حال حاضر موجود نیست", "error");
      return;
    }

    setIsCartProcessing(true);
    try {
      await dispatch(
        addToCart({
          productId: product.id,
          quantity: 1,
          size: product.sizes?.[0] || null,
          color: product.colors?.[0] || null,
        })
      ).unwrap();
      showToast("محصول به سبد خرید اضافه شد", "success");
    } catch (error) {
      showToast(error || "خطا در افزودن به سبد خرید", "error");
    } finally {
      setIsCartProcessing(false);
    }
  };

  const handleIncreaseQuantity = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCartProcessing || !cartItem) return;

    if (cartQuantity >= availableStock) {
      showToast(`موجودی این محصول فقط ${availableStock} عدد است`, "error");
      return;
    }

    setIsCartProcessing(true);
    try {
      await dispatch(
        updateCartItem({
          itemId: cartItem.id,
          quantity: cartQuantity + 1,
        })
      ).unwrap();
    } catch (error) {
      showToast(error || "خطا در به‌روزرسانی سبد خرید", "error");
    } finally {
      setIsCartProcessing(false);
    }
  };

  const handleDecreaseQuantity = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCartProcessing || !cartItem || cartQuantity <= 1) return;

    setIsCartProcessing(true);
    try {
      await dispatch(
        updateCartItem({
          itemId: cartItem.id,
          quantity: cartQuantity - 1,
        })
      ).unwrap();
    } catch (error) {
      showToast(error || "خطا در به‌روزرسانی سبد خرید", "error");
    } finally {
      setIsCartProcessing(false);
    }
  };

  const handleRemoveFromCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCartProcessing || !cartItem) return;

    setIsCartProcessing(true);
    try {
      await dispatch(removeFromCart(cartItem.id)).unwrap();
      showToast("محصول از سبد خرید حذف شد", "success");
    } catch (error) {
      showToast(error || "خطا در حذف از سبد خرید", "error");
    } finally {
      setIsCartProcessing(false);
    }
  };

  return {
    isLiked,
    cartItem,
    cartQuantity,
    isInCart,
    availableStock,
    isOutOfStock,
    isCartProcessing,
    handleToggleFavorite,
    handleAddToCart,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveFromCart,
  };
}

