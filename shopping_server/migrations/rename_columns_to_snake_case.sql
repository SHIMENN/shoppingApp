-- Migration: Rename columns to snake_case
-- Date: 2026-01-20
-- Description: Rename all multi-word columns from camelCase to snake_case

-- Users table
ALTER TABLE users
  RENAME COLUMN "userId" TO user_id;

ALTER TABLE users
  RENAME COLUMN "firstName" TO first_name;

ALTER TABLE users
  RENAME COLUMN "lastName" TO last_name;

ALTER TABLE users
  RENAME COLUMN "googleId" TO google_id;

ALTER TABLE users
  RENAME COLUMN "createdAt" TO created_at;

-- Products table
ALTER TABLE products
  RENAME COLUMN "productId" TO product_id;

ALTER TABLE products
  RENAME COLUMN "imageUrl" TO image_url;

-- Carts table
ALTER TABLE carts
  RENAME COLUMN "cartId" TO cart_id;

ALTER TABLE carts
  RENAME COLUMN "createdAt" TO created_at;

ALTER TABLE carts
  RENAME COLUMN "userUserId" TO user_user_id;

-- Cart Items table (also fix table name)
ALTER TABLE "cart items"
  RENAME TO cart_items;

ALTER TABLE cart_items
  RENAME COLUMN "cartItemId" TO cart_item_id;

ALTER TABLE cart_items
  RENAME COLUMN "cartCartId" TO cart_cart_id;

ALTER TABLE cart_items
  RENAME COLUMN "productId" TO product_id;

-- Order Items table (fix table name if needed)
-- Note: If the table is already named 'order_items', this will fail - that's OK
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'orderitems'
  ) THEN
    ALTER TABLE orderitems RENAME TO order_items;
  END IF;
END $$;
