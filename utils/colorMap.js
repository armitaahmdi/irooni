// Map Persian color names to hex codes
// Based on the provided HTML example
export const colorMap = {
  // Basic Colors
  "مشکی": "#000000",
  "سفید": "#FFFFFF",
  "آبی": "#1E73BE", // rgb(30,115,190)
  "خاکستری": "#B2B2B2", // rgb(178,178,178)
  "طوسی": "#B2B2B2",
  
  // Blue Variations
  "آبی آسمانی": "#87CEEB", // Sky Blue - درست است
  "آبی روشن": "#4A9EFF", // Light Blue - آبی روشن واقعی
  "آبی طوسی": "#8DA9C4", // Blue Gray - درست است
  "آبی نفتی": "#1B3A57", // Navy Blue - آبی نفتی واقعی
  "بلو بلک": "#000080", // Blue Black - درست است
  "سرمه ای": "#001A33", // Dark Navy - درست است
  
  // Green Variations
  "سبز": "#498728", // Green - درست است
  "سبز سدری": "#94BC69", // Cedar Green - سبز سدری واقعی
  "سبز یشمی": "#104F2F", // Jade Green - درست است
  "سبز پاستیلی": "#A9CFCB", // Pastel Green - درست است
  "سبز تیره": "#004B49", // Dark Green - درست است
  "سبز روشن": "#90EE90", // Light Green - سبز روشن واقعی (نه خیلی روشن)
  "زیتونی": "#6B8E23", // Olive Green - زیتونی واقعی
  
  // Red/Pink Variations
  "قرمز": "#DC2626", // Red - قرمز واقعی
  "زرشکی": "#8B0000", // Dark Red - زرشکی واقعی
  "صورتی": "#FFC0CB", // Pink - درست است
  "گلبهی": "#FFB6C1", // Rose Pink - گلبهی واقعی
  
  // Orange/Yellow Variations
  "نارنجی": "#FF8C00", // Orange - نارنجی واقعی
  "زرد": "#FFD700", // Yellow - زرد واقعی
  "زرد کره ای": "#FFE4B5", // Butter Yellow - زرد کره‌ای واقعی
  
  // Brown/Beige Variations
  "قهوه‌ای": "#8B4513", // Brown - قهوه‌ای واقعی
  "بژ": "#F5F5DC", // Beige - درست است
  "کرم": "#FFFDD0", // Cream - درست است
  "کرمی": "#F5DEB3", // Creamy - کرمی واقعی
  "کرم تیره": "#D2B48C", // Dark Cream - کرم تیره واقعی
  "کرم روشن": "#FFF8DC", // Light Cream - کرم روشن واقعی
  "شتری": "#D4AF37", // Camel - شتری واقعی
  
  // Gray Variations
  "طوسی تیره": "#878787", // rgb(135,135,135)
  "طوسی روشن": "#E8E8E8", // rgb(232,232,232)
  "ذغالی": "#707070", // rgb(112,112,112)
  
  // Purple Variations
  "بنفش": "#8B00FF", // Purple - بنفش واقعی
  "یاسی": "#DA70D6", // Lavender - یاسی واقعی
  
  // Mixed Colors
  "سرمه ای قرمز": "#2B1A33", // Navy Red - ترکیب سرمه‌ای و قرمز
  "سرمه ای قهوه ای": "#1A1A0A", // Navy Brown - ترکیب سرمه‌ای و قهوه‌ای
  "سفید خاکستری": "#E8E8E8", // White Gray - سفید خاکستری واقعی
  "سفید زرد": "#FFFEF0", // White Yellow - سفید زرد واقعی
  "طوسی مشکی": "#2F2F2F", // Gray Black - طوسی مشکی واقعی
  "مشکی سفید": "#404040", // Black White - مشکی سفید (خاکستری تیره)
};

export const getColorHex = (colorName) => {
  return colorMap[colorName] || "#6B7280"; // Default to gray if not found
};

export const getColorBorder = (colorName) => {
  const hex = getColorHex(colorName);
  // For white, use a border
  if (colorName === "سفید" || colorName === "کرم" || colorName === "بژ" || colorName === "کرمی" || colorName === "کرم روشن" || colorName === "کرم تیره") {
    return "border-2 border-gray-300";
  }
  return "";
};
