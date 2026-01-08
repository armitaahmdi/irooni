-- Migration: Add sizeStock field to products table
-- Run this SQL command in your database to add the sizeStock field

ALTER TABLE "products" 
ADD COLUMN IF NOT EXISTS "sizeStock" JSONB;

-- This field stores stock per size as JSON: {"S": 5, "M": 3, "L": 0}

