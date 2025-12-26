// All products data with complete information
export const allProducts = [
  {
    id: 1,
    name: "تیشرت اسپرت مردانه آستین کوتاه",
    code: "TSH-001",
    category: "tshirt",
    subcategory: "short-sleeve",
    image: "/banners/outfit-banner.png",
    images: [
      "/banners/outfit-banner.png",
      "/banners/outwear-banner.png",
      "/banners/belt-banner.png",
      "/banners/sneakers.png",
    ],
    price: 420000,
    originalPrice: 520000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["مشکی", "سفید", "آبی", "خاکستری"],
    inStock: true,
    material: "پنبه 100%",
    sizeChart: [
      { size: "S", chest: "54", length: "68" },
      { size: "M", chest: "56", length: "70" },
      { size: "L", chest: "60", length: "70" },
      { size: "XL", chest: "62", length: "72" },
      { size: "XXL", chest: "66", length: "74" },
    ],
    description: "تیشرت اسپرت مردانه با کیفیت بالا و پارچه نرم و راحت. مناسب برای استفاده روزمره و ورزش.",
    features: [
      "پارچه 100% پنبه",
      "قابل شستشو در ماشین",
      "نرم و راحت",
      "مناسب برای تمام فصول",
    ],
  },
  {
    id: 2,
    name: "شلوار جین اسلیم فیت آبی",
    code: "PNT-002",
    category: "pants",
    subcategory: "jeans",
    image: "/banners/belt-banner.png",
    images: [
      "/banners/belt-banner.png",
      "/banners/outfit-banner.png",
      "/banners/outwear-banner.png",
      "/banners/sneakers.png",
    ],
    price: 680000,
    originalPrice: null,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["آبی", "مشکی", "خاکستری"],
    inStock: true,
    material: "جین 98% پنبه، 2% الاستین",
    sizeChart: [
      { size: "28", waist: "71", length: "102" },
      { size: "30", waist: "76", length: "102" },
      { size: "32", waist: "81", length: "102" },
      { size: "34", waist: "86", length: "102" },
      { size: "36", waist: "91", length: "102" },
    ],
    description: "شلوار جین اسلیم فیت با برش مدرن و کیفیت عالی. مناسب برای استایل کژوال و روزمره.",
    features: [
      "جین با کیفیت بالا",
      "اسلیم فیت",
      "قابل شستشو",
      "دوام بالا",
    ],
  },
  {
    id: 3,
    name: "کلاه کپ اسپرت مشکی",
    code: "HAT-003",
    category: "accessories",
    subcategory: "hat",
    image: "/banners/sneakers.png",
    images: [
      "/banners/sneakers.png",
      "/banners/outfit-banner.png",
      "/banners/outwear-banner.png",
      "/banners/belt-banner.png",
    ],
    price: 180000,
    originalPrice: 250000,
    sizes: ["یک سایز"],
    colors: ["مشکی", "سفید", "خاکستری", "آبی"],
    inStock: true,
    material: "پنبه 80%، پلی‌استر 20%",
    sizeChart: null,
    description: "کلاه کپ اسپرت با طراحی مدرن و کیفیت بالا. مناسب برای محافظت از آفتاب و استایل روزمره.",
    features: [
      "قابل تنظیم",
      "نرم و راحت",
      "قابل شستشو",
      "طراحی مدرن",
    ],
  },
  {
    id: 4,
    name: "تیشرت پولو مردانه سفید",
    code: "TSH-004",
    category: "tshirt",
    subcategory: "polo",
    image: "/banners/outwear-banner.png",
    images: [
      "/banners/outwear-banner.png",
      "/banners/outfit-banner.png",
      "/banners/belt-banner.png",
      "/banners/sneakers.png",
    ],
    price: 450000,
    originalPrice: null,
    sizes: ["S", "M", "L", "XL"],
    colors: ["سفید", "آبی", "مشکی"],
    inStock: true,
    material: "پنبه 100%",
    sizeChart: [
      { size: "S", chest: "54", length: "68" },
      { size: "M", chest: "56", length: "70" },
      { size: "L", chest: "60", length: "70" },
      { size: "XL", chest: "62", length: "72" },
    ],
    description: "تیشرت پولو مردانه با یقه کلاسیک و طراحی شیک. مناسب برای استایل نیمه رسمی و کژوال.",
    features: [
      "یقه پولو",
      "پارچه با کیفیت",
      "قابل شستشو",
      "مناسب برای تمام فصول",
    ],
  },
  {
    id: 5,
    name: "شلوارک ورزشی مردانه",
    code: "PNT-005",
    category: "pants",
    subcategory: "fabric",
    image: "/banners/IROONI_sports.png",
    images: [
      "/banners/IROONI_sports.png",
      "/banners/outfit-banner.png",
      "/banners/outwear-banner.png",
      "/banners/belt-banner.png",
    ],
    price: 320000,
    originalPrice: 400000,
    sizes: ["S", "M", "L", "XL"],
    colors: ["مشکی", "خاکستری", "آبی"],
    inStock: true,
    material: "پلی‌استر 90%، الاستین 10%",
    sizeChart: [
      { size: "S", waist: "76", length: "45" },
      { size: "M", waist: "81", length: "47" },
      { size: "L", waist: "86", length: "49" },
      { size: "XL", waist: "91", length: "51" },
    ],
    description: "شلوارک ورزشی با پارچه نرم و قابل تنفس. مناسب برای ورزش و فعالیت‌های روزمره.",
    features: [
      "پارچه ورزشی",
      "قابل تنفس",
      "کش مناسب",
      "قابل شستشو",
    ],
  },
  // اضافه کردن محصولات بیشتر برای تست
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 6,
    name: `محصول نمونه ${i + 6}`,
    code: `PRD-${String(i + 6).padStart(3, "0")}`,
    category: ["tshirt", "pants", "shoes", "accessories"][i % 4],
    subcategory: "short-sleeve",
    image: "/banners/outfit-banner.png",
    images: [
      "/banners/outfit-banner.png",
      "/banners/outwear-banner.png",
      "/banners/belt-banner.png",
      "/banners/sneakers.png",
    ],
    price: 300000 + (i * 50000),
    originalPrice: i % 3 === 0 ? 400000 + (i * 50000) : null,
    sizes: ["S", "M", "L", "XL"],
    colors: ["مشکی", "سفید", "آبی"],
    inStock: true,
    material: "پنبه 100%",
    sizeChart: [
      { size: "S", chest: "54", length: "68" },
      { size: "M", chest: "56", length: "70" },
      { size: "L", chest: "60", length: "70" },
      { size: "XL", chest: "62", length: "72" },
    ],
    description: "توضیحات محصول نمونه",
    features: ["ویژگی 1", "ویژگی 2", "ویژگی 3"],
  })),
];

// Helper functions
export const getProductsByCategory = (category) => {
  return allProducts.filter((product) => product.category === category);
};

export const getProductsBySubcategory = (category, subcategory) => {
  return allProducts.filter(
    (product) =>
      product.category === category && product.subcategory === subcategory
  );
};

export const getProductById = (id) => {
  return allProducts.find((product) => product.id === parseInt(id));
};

export const getRelatedProducts = (productId, limit = 4) => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return allProducts
    .filter(
      (p) =>
        p.id !== productId &&
        (p.category === product.category || p.subcategory === product.subcategory)
    )
    .slice(0, limit);
};

