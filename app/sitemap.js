import { prisma } from "@/lib/prisma";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://irooni.com";

  // اگر prisma در دسترس نباشد، فقط صفحات استاتیک را برگردان
  if (!prisma) {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ];
  }

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/size-guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Category pages
  const categoryPages = [];
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null }, // فقط دسته‌های اصلی
      select: { slug: true, updatedAt: true },
    });

    for (const category of categories) {
      categoryPages.push({
        url: `${baseUrl}/${category.slug}`,
        lastModified: category.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });

      // زیردسته‌ها
      const subcategories = await prisma.category.findMany({
        where: { parentId: category.id },
        select: { slug: true, updatedAt: true },
      });

      for (const subcategory of subcategories) {
        categoryPages.push({
          url: `${baseUrl}/${category.slug}/${subcategory.slug}`,
          lastModified: subcategory.updatedAt || new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error);
  }

  // Product pages with images
  const productPages = [];
  try {
    const products = await prisma.product.findMany({
      where: { OR: [{ isVisible: true }, { isVisible: null }] },
      select: {
        slug: true,
        updatedAt: true,
        image: true,
        images: true,
        name: true,
        category: {
          select: { slug: true },
        },
        subcategory: {
          select: { slug: true },
        },
      },
      take: 50000, // Google limit: 50,000 URLs per sitemap
    });

    for (const product of products) {
      if (product.slug) {
        // ساخت URL بر اساس category و subcategory
        let productUrl = baseUrl;
        if (product.category?.slug && product.subcategory?.slug) {
          productUrl = `${baseUrl}/${product.category.slug}/${product.subcategory.slug}/${product.slug}`;
        } else if (product.category?.slug) {
          productUrl = `${baseUrl}/${product.category.slug}/${product.slug}`;
        } else {
          // Fallback به slug محصول
          productUrl = `${baseUrl}/product/${product.slug}`;
        }

        // ساخت لیست تصاویر برای Google Images
        const images = [];
        if (product.image) {
          const imageUrl = product.image.startsWith("http")
            ? product.image
            : `${baseUrl}${product.image}`;
          images.push({
            loc: imageUrl,
            title: product.name,
            caption: product.name,
          });
        }
        if (product.images && Array.isArray(product.images)) {
          product.images.forEach((img) => {
            if (img) {
              const imageUrl = img.startsWith("http") ? img : `${baseUrl}${img}`;
              images.push({
                loc: imageUrl,
                title: product.name,
                caption: product.name,
              });
            }
          });
        }

        productPages.push({
          url: productUrl,
          lastModified: product.updatedAt || new Date(),
          changeFrequency: "weekly",
          priority: 0.7, // افزایش priority برای محصولات
          // Next.js automatically handles images array for sitemap
          ...(images.length > 0 && { images: images }),
        });
      }
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // Blog pages
  const blogPages = [];
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, image: true, title: true },
    });

    for (const article of articles) {
      const articleImages = [];
      if (article.image) {
        const imageUrl = article.image.startsWith("http")
          ? article.image
          : `${baseUrl}${article.image}`;
        articleImages.push({
          loc: imageUrl,
          title: article.title || "مقاله",
          caption: article.title || "مقاله",
        });
      }

      blogPages.push({
        url: `${baseUrl}/blog/${article.slug}`,
        lastModified: article.updatedAt || new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        ...(articleImages.length > 0 && { images: articleImages }),
      });
    }
  } catch (error) {
    console.error("Error fetching articles for sitemap:", error);
  }

  // ترکیب همه صفحات
  const allPages = [...staticPages, ...categoryPages, ...productPages, ...blogPages];

  // محدودیت Google: حداکثر 50,000 URL در یک sitemap
  if (allPages.length > 50000) {
    console.warn(
      `⚠️ Sitemap contains ${allPages.length} URLs. Google recommends splitting into multiple sitemaps when exceeding 50,000 URLs.`
    );
    return allPages.slice(0, 50000);
  }

  return allPages;
}
