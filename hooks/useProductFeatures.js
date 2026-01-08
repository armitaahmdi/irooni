import { useState, useCallback } from "react";

/**
 * Hook for managing product features
 */
export function useProductFeatures(formData, setFormData) {
  const [newFeature, setNewFeature] = useState("");

  const addFeature = useCallback(() => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), newFeature.trim()],
      });
      setNewFeature("");
    }
  }, [newFeature, formData, setFormData]);

  const removeFeature = useCallback(
    (index) => {
      setFormData({
        ...formData,
        features: (formData.features || []).filter((_, i) => i !== index),
      });
    },
    [formData, setFormData]
  );

  return {
    newFeature,
    setNewFeature,
    addFeature,
    removeFeature,
  };
}

