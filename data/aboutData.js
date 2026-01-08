import { Check, Heart, Target, Award, Users, ShoppingBag, TrendingUp, Clock, Star, Shield, Truck, Sparkles } from "lucide-react";

export const aboutStats = [
  { number: "۱۰+", label: "سال تجربه", icon: <Clock className="w-8 h-8" /> },
  { number: "۵۰,۰۰۰+", label: "مشتری راضی", icon: <Users className="w-8 h-8" /> },
  { number: "۱۰,۰۰۰+", label: "محصول باکیفیت", icon: <ShoppingBag className="w-8 h-8" /> },
  { number: "۹۸%", label: "رضایت مشتری", icon: <Star className="w-8 h-8" /> },
];

export const aboutValues = [
  {
    icon: <Target className="w-10 h-10" />,
    title: "ماموریت ما",
    description: "ارائه بهترین کیفیت پوشاک مردانه با قیمت مناسب و خدمات عالی به مشتریان. ما متعهدیم که تجربه خرید راحت و مطمئنی را برای شما فراهم کنیم.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Heart className="w-10 h-10" />,
    title: "ارزش‌های ما",
    description: "صداقت، کیفیت، رضایت مشتری و احترام به سلیقه و نیازهای مشتریان در اولویت ماست. ما به روابط بلندمدت با مشتریانمان اهمیت می‌دهیم.",
    color: "from-red-500 to-pink-600",
  },
  {
    icon: <Award className="w-10 h-10" />,
    title: "تضمین کیفیت",
    description: "تمام محصولات ما با ضمانت اصالت و کیفیت عرضه می‌شوند. ما فقط محصولاتی را ارائه می‌دهیم که خودمان از کیفیت آن‌ها مطمئن هستیم.",
    color: "from-yellow-500 to-orange-600",
  },
  {
    icon: <TrendingUp className="w-10 h-10" />,
    title: "نوآوری",
    description: "همیشه در تلاشیم تا جدیدترین ترندها و استایل‌های روز را به شما ارائه دهیم و همگام با تغییرات دنیای مد پیش برویم.",
    color: "from-green-500 to-emerald-600",
  },
];

export const aboutFeatures = [
  {
    icon: <Truck className="w-6 h-6" />,
    title: "ارسال سریع و رایگان",
    description: "ارسال رایگان بالای ۳ میلیون تومان در سراسر ایران",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "ضمانت اصالت",
    description: "ضمانت اصالت و عدم مغایرت کالا با ۷ روز مهلت بازگشت",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "پشتیبانی ۲۴ ساعته",
    description: "تیم پشتیبانی ما همیشه آماده پاسخگویی به سوالات شماست",
  },
  {
    icon: <Check className="w-6 h-6" />,
    title: "بازگشت و تعویض آسان",
    description: "امکان بازگشت و تعویض محصول تا ۷ روز پس از دریافت",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "پرداخت امن",
    description: "پرداخت امن و مطمئن با تمام روش‌های پرداخت آنلاین",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "تنوع بالا",
    description: "بیش از ۱۰,۰۰۰ محصول در دسته‌بندی‌های مختلف",
  },
];

export const aboutTimeline = [
  {
    year: "۱۳۹۰",
    title: "شروع فعالیت",
    description: "پوشاک ایرونی با هدف ارائه بهترین کیفیت پوشاک مردانه تأسیس شد",
  },
  {
    year: "۱۳۹۵",
    title: "گسترش آنلاین",
    description: "راه‌اندازی فروشگاه اینترنتی و شروع فروش آنلاین",
  },
  {
    year: "۱۴۰۰",
    title: "رسیدن به ۱۰,۰۰۰ مشتری",
    description: "دست‌یابی به بیش از ۱۰,۰۰۰ مشتری راضی در سراسر ایران",
  },
  {
    year: "۱۴۰۳",
    title: "توسعه و نوآوری",
    description: "افزایش تنوع محصولات و بهبود خدمات به مشتریان",
  },
];

export const aboutStructuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "mainEntity": {
    "@type": "Organization",
    "name": "پوشاک ایرونی",
    "alternateName": "Irooni Clothing",
    "url": "https://irooni.com",
    "logo": "https://irooni.com/logo/main-logo.png",
    "description": "فروشگاه تخصصی پوشاک مردانه با بیش از یک دهه تجربه در ارائه بهترین کیفیت و استایل‌های روز",
    "foundingDate": "2011",
    "founder": {
      "@type": "Person",
      "name": "تیم پوشاک ایرونی"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "قزوین",
      "addressRegion": "قزوین",
      "postalCode": "",
      "addressCountry": "IR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+982833335244",
      "contactType": "customer service",
      "areaServed": "IR",
      "availableLanguage": ["Persian", "Farsi"]
    },
    "sameAs": [
      "https://irooni.com"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250"
    }
  }
};

