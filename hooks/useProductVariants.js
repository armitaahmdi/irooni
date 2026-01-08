import { useCallback } from "react";

/**
 * Hook for managing product variants (sizes and colors)
 */
export function useProductVariants(formData, setFormData) {
  const toggleSize = useCallback(
    (size) => {
      const currentSizes = formData.sizes || [];
      const newSizes = currentSizes.includes(size)
        ? currentSizes.filter((s) => s !== size)
        : [...currentSizes, size];

      let newVariants = [...(formData.variants || [])];
      const colors = formData.colors || [];

      if (!currentSizes.includes(size)) {
        colors.forEach((color) => {
          const exists = newVariants.some((v) => v.size === size && v.color === color);
          if (!exists) {
            newVariants.push({
              color,
              size,
              price: formData.price || 0,
              stock: 0,
              image: null,
            });
          }
        });
      } else {
        newVariants = newVariants.filter((v) => v.size !== size);
      }

      const newSizeStock = { ...formData.sizeStock };
      if (!currentSizes.includes(size)) {
        newSizeStock[size] = {};
        colors.forEach((color) => {
          newSizeStock[size][color] = 0;
        });
      } else {
        delete newSizeStock[size];
      }

      setFormData({
        ...formData,
        sizes: newSizes,
        variants: newVariants,
        sizeStock: newSizeStock,
      });
    },
    [formData, setFormData]
  );

  const toggleColor = useCallback(
    (color) => {
      const currentColors = formData.colors || [];
      const newColors = currentColors.includes(color)
        ? currentColors.filter((c) => c !== color)
        : [...currentColors, color];

      let newVariants = [...(formData.variants || [])];
      const sizes = formData.sizes || [];

      if (!currentColors.includes(color)) {
        sizes.forEach((size) => {
          const exists = newVariants.some((v) => v.size === size && v.color === color);
          if (!exists) {
            newVariants.push({
              color,
              size,
              price: formData.price || 0,
              stock: 0,
              image: null,
            });
          }
        });
      } else {
        newVariants = newVariants.filter((v) => v.color !== color);
      }

      const newSizeStock = { ...formData.sizeStock };
      if (!currentColors.includes(color)) {
        sizes.forEach((size) => {
          if (!newSizeStock[size]) {
            newSizeStock[size] = {};
          }
          newSizeStock[size][color] = 0;
        });
      } else {
        sizes.forEach((size) => {
          if (newSizeStock[size]) {
            delete newSizeStock[size][color];
          }
        });
      }

      setFormData({
        ...formData,
        colors: newColors,
        variants: newVariants,
        sizeStock: newSizeStock,
      });
    },
    [formData, setFormData]
  );

  const updateVariantStock = useCallback(
    (size, color, stockValue) => {
      const stock = parseInt(stockValue) || 0;
      const newVariants = [...(formData.variants || [])];
      const variantIndex = newVariants.findIndex((v) => v.size === size && v.color === color);

      if (variantIndex >= 0) {
        newVariants[variantIndex] = {
          ...newVariants[variantIndex],
          stock,
        };
      } else {
        newVariants.push({
          color,
          size,
          price: formData.price || 0,
          stock,
          image: null,
        });
      }

      const newSizeStock = {
        ...(formData.sizeStock || {}),
        [size]: {
          ...(formData.sizeStock?.[size] || {}),
          [color]: stock,
        },
      };

      setFormData({
        ...formData,
        variants: newVariants,
        sizeStock: newSizeStock,
      });
    },
    [formData, setFormData]
  );

  return {
    toggleSize,
    toggleColor,
    updateVariantStock,
  };
}

