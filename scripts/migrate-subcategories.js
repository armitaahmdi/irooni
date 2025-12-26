/**
 * Migration script to convert subcategory names (Persian) to slugs
 * Run this once to fix existing products in the database
 * 
 * Usage: node scripts/migrate-subcategories.js
 */

const { PrismaClient } = require("@prisma/client");
const { productCategories } = require("../data/categories");

const prisma = new PrismaClient();

function getSubcategorySlugByName(categorySlug, subcategoryName) {
  const category = productCategories.find((cat) => cat.slug === categorySlug);
  if (!category) return null;

  const subcategory = category.subcategories.find(
    (sub) => sub.name === subcategoryName
  );
  return subcategory ? subcategory.slug : null;
}

async function migrateSubcategories() {
  try {
    console.log("Starting subcategory migration...");

    // Get all products
    const products = await prisma.product.findMany({
      where: {
        subcategory: { not: null },
      },
    });

    console.log(`Found ${products.length} products with subcategories`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const product of products) {
      try {
        // Check if subcategory is already a slug
        const category = productCategories.find(
          (cat) => cat.slug === product.category
        );

        if (!category) {
          console.log(
            `Skipping product ${product.id}: Category ${product.category} not found`
          );
          skipped++;
          continue;
        }

        // Check if it's already a slug
        const isSlug = category.subcategories.some(
          (sub) => sub.slug === product.subcategory
        );

        if (isSlug) {
          console.log(
            `Skipping product ${product.id}: Subcategory ${product.subcategory} is already a slug`
          );
          skipped++;
          continue;
        }

        // Try to convert name to slug
        const slug = getSubcategorySlugByName(
          product.category,
          product.subcategory
        );

        if (!slug) {
          console.log(
            `Skipping product ${product.id}: Could not find slug for subcategory "${product.subcategory}" in category "${product.category}"`
          );
          skipped++;
          continue;
        }

        // Update product
        await prisma.product.update({
          where: { id: product.id },
          data: { subcategory: slug },
        });

        console.log(
          `Updated product ${product.id}: "${product.subcategory}" -> "${slug}"`
        );
        updated++;
      } catch (error) {
        console.error(`Error updating product ${product.id}:`, error.message);
        errors++;
      }
    }

    console.log("\nMigration completed!");
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}`);
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateSubcategories();

