import { useState, useCallback } from "react";

/**
 * Hook for managing product size chart
 */
export function useProductSizeChart(formData, setFormData) {
  const [newSizeChart, setNewSizeChart] = useState({ size: "", chest: "", length: "" });

  const addSizeChart = useCallback(() => {
    if (newSizeChart.size && newSizeChart.chest && newSizeChart.length) {
      setFormData({
        ...formData,
        sizeChart: [...(formData.sizeChart || []), { ...newSizeChart }],
      });
      setNewSizeChart({ size: "", chest: "", length: "" });
    }
  }, [newSizeChart, formData, setFormData]);

  const removeSizeChart = useCallback(
    (index) => {
      setFormData({
        ...formData,
        sizeChart: (formData.sizeChart || []).filter((_, i) => i !== index),
      });
    },
    [formData, setFormData]
  );

  return {
    newSizeChart,
    setNewSizeChart,
    addSizeChart,
    removeSizeChart,
  };
}

