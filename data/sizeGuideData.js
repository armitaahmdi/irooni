import { Shirt, Package, Footprints, Ruler, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

/**
 * Size guide data configuration
 */
export const sizeGuides = {
  tshirt: {
    title: "تیشرت و پولوشرت",
    icon: <Shirt className="w-6 h-6" />,
    description: "جدول سایز برای تیشرت، پولوشرت و تاپ",
    measurements: ["سایز", "عرض سینه (cm)", "قد لباس (cm)", "عرض شانه (cm)"],
    sizes: [
      { size: "S", chest: "48-50", length: "68-70", shoulder: "42-44" },
      { size: "M", chest: "52-54", length: "70-72", shoulder: "44-46" },
      { size: "L", chest: "56-58", length: "72-74", shoulder: "46-48" },
      { size: "XL", chest: "60-62", length: "74-76", shoulder: "48-50" },
      { size: "2XL", chest: "64-66", length: "76-78", shoulder: "50-52" },
      { size: "3XL", chest: "68-70", length: "78-80", shoulder: "52-54" },
    ],
  },
  shirt: {
    title: "پیراهن",
    icon: <Shirt className="w-6 h-6" />,
    description: "جدول سایز برای پیراهن رسمی و غیررسمی",
    measurements: ["سایز", "عرض سینه (cm)", "قد لباس (cm)", "یقه (cm)"],
    sizes: [
      { size: "S", chest: "48-50", length: "72-74", collar: "37-38" },
      { size: "M", chest: "52-54", length: "74-76", collar: "39-40" },
      { size: "L", chest: "56-58", length: "76-78", collar: "41-42" },
      { size: "XL", chest: "60-62", length: "78-80", collar: "43-44" },
      { size: "2XL", chest: "64-66", length: "80-82", collar: "45-46" },
      { size: "3XL", chest: "68-70", length: "82-84", collar: "47-48" },
    ],
  },
  pants: {
    title: "شلوار",
    icon: <Package className="w-6 h-6" />,
    description: "جدول سایز برای شلوار، جین و شلوارک",
    measurements: ["سایز", "دور کمر (cm)", "دور باسن (cm)", "قد شلوار (cm)"],
    sizes: [
      { size: "S", waist: "76-80", hip: "88-92", length: "100-102" },
      { size: "M", waist: "80-84", hip: "92-96", length: "102-104" },
      { size: "L", waist: "84-88", hip: "96-100", length: "104-106" },
      { size: "XL", waist: "88-92", hip: "100-104", length: "106-108" },
      { size: "2XL", waist: "92-96", hip: "104-108", length: "108-110" },
      { size: "3XL", waist: "96-100", hip: "108-112", length: "110-112" },
    ],
  },
  shoes: {
    title: "کفش",
    icon: <Footprints className="w-6 h-6" />,
    description: "جدول سایز برای کفش و صندل",
    measurements: ["سایز اروپا", "سایز ایران", "طول پا (cm)", "عرض پا (cm)"],
    sizes: [
      { size: "40", iran: "40", length: "25", width: "9.5" },
      { size: "41", iran: "41", length: "25.5", width: "9.8" },
      { size: "42", iran: "42", length: "26", width: "10" },
      { size: "43", iran: "43", length: "26.5", width: "10.2" },
      { size: "44", iran: "44", length: "27", width: "10.5" },
      { size: "45", iran: "45", length: "27.5", width: "10.8" },
      { size: "46", iran: "46", length: "28", width: "11" },
      { size: "47", iran: "47", length: "28.5", width: "11.2" },
    ],
  },
};

export const tips = [
  {
    icon: <Ruler className="w-6 h-6" />,
    title: "اندازه‌گیری صحیح",
    description:
      "برای اندازه‌گیری دقیق، از متر نرم استفاده کنید و آن را به صورت افقی و بدون کشش دور قسمت مورد نظر بپیچید.",
  },
  {
    icon: <AlertCircle className="w-6 h-6" />,
    title: "توجه به جنس پارچه",
    description:
      "پارچه‌های کشی ممکن است سایز متفاوتی داشته باشند. در صورت شک، سایز بزرگ‌تر را انتخاب کنید.",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "سایز بین دو اندازه",
    description:
      "اگر اندازه شما بین دو سایز قرار دارد، سایز بزرگ‌تر را انتخاب کنید تا راحتی بیشتری داشته باشید.",
  },
  {
    icon: <HelpCircle className="w-6 h-6" />,
    title: "نیاز به کمک دارید؟",
    description:
      "در صورت نیاز به راهنمایی بیشتر، می‌توانید با پشتیبانی ما تماس بگیرید تا شما را راهنمایی کنیم.",
  },
];

export const measurementSteps = [
  {
    number: 1,
    color: "from-blue-500 to-blue-600",
    title: "عرض سینه",
    description:
      "متر را دور پهن‌ترین قسمت سینه (زیر بغل) بپیچید و آن را به صورت افقی و بدون کشش نگه دارید. عدد را یادداشت کنید.",
  },
  {
    number: 2,
    color: "from-green-500 to-green-600",
    title: "دور کمر",
    description:
      "متر را دور باریک‌ترین قسمت کمر (معمولاً بالای ناف) بپیچید. مطمئن شوید متر به صورت افقی و بدون فشردگی است.",
  },
  {
    number: 3,
    color: "from-purple-500 to-purple-600",
    title: "قد لباس",
    description:
      "از بالای شانه تا پایین لباس (جایی که می‌خواهید لباس تمام شود) اندازه بگیرید. برای شلوار از کمر تا مچ پا اندازه بگیرید.",
  },
  {
    number: 4,
    color: "from-orange-500 to-orange-600",
    title: "عرض شانه",
    description:
      "از انتهای یک شانه تا انتهای شانه دیگر را اندازه بگیرید. این اندازه برای تیشرت و تاپ مهم است.",
  },
  {
    number: 5,
    color: "from-pink-500 to-pink-600",
    title: "دور باسن",
    description:
      "متر را دور پهن‌ترین قسمت باسن بپیچید. این اندازه برای انتخاب سایز شلوار بسیار مهم است.",
  },
  {
    number: 6,
    color: "from-teal-500 to-teal-600",
    title: "یقه پیراهن",
    description:
      "دور گردن را در پایین‌ترین قسمت (جایی که یقه پیراهن قرار می‌گیرد) اندازه بگیرید. یک انگشت آزادی اضافه کنید.",
  },
  {
    number: 7,
    color: "from-indigo-500 to-indigo-600",
    title: "اندازه پا (کفش)",
    description:
      "طول پا را از نوک انگشت شست تا پاشنه اندازه بگیرید. بهتر است این کار را در پایان روز انجام دهید چون پاها کمی بزرگ‌تر می‌شوند.",
    colSpan: "md:col-span-2 lg:col-span-1",
  },
];

