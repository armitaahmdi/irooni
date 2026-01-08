-- Add rating column to products table
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "rating" DOUBLE PRECISION DEFAULT 4.8;
