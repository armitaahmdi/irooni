/**
 * Get available sizes based on category
 */
export const getAvailableSizes = (category) => {
  if (category === "shoes" || category === "pants") {
    return ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"];
  }
  return ["S", "M", "L", "XL", "XXL", "3XL"];
};

