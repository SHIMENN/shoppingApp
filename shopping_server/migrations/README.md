# Database Migrations

## Running Migrations

### Manual SQL Migration

To rename columns from camelCase to snake_case, run the following command:

```bash
# Using psql
psql -U your_username -d your_database_name -f migrations/rename_columns_to_snake_case.sql

# Or using docker if running PostgreSQL in container
docker exec -i your_postgres_container psql -U your_username -d your_database_name < migrations/rename_columns_to_snake_case.sql
```

Replace:
- `your_username` with your PostgreSQL username (e.g., `postgres`)
- `your_database_name` with your database name (e.g., `shopping_db`)
- `your_postgres_container` with your Docker container name if applicable

### Important Notes

1. **Backup First**: Always backup your database before running migrations:
   ```bash
   pg_dump -U your_username your_database_name > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Test Environment**: Test migrations in a development environment before production

3. **synchronize: true**: The app currently uses `synchronize: true` in TypeORM. After running this migration, TypeORM will detect the correct column names and won't try to recreate them.

## Migration Details

### rename_columns_to_snake_case.sql

This migration renames all multi-word columns to use snake_case naming convention:

**Users table:**
- `userId` → `user_id`
- `firstName` → `first_name`
- `lastName` → `last_name`
- `googleId` → `google_id`
- `createdAt` → `created_at`

**Products table:**
- `productId` → `product_id`
- `imageUrl` → `image_url`

**Carts table:**
- `cartId` → `cart_id`
- `createdAt` → `created_at`
- `userUserId` → `user_user_id`

**Cart Items table:**
- Table name: `cart items` → `cart_items`
- `cartItemId` → `cart_item_id`
- `cartCartId` → `cart_cart_id`
- `productId` → `product_id`

**Order Items table:**
- Table name: `orderitems` → `order_items` (if needed)
- Columns already use snake_case

**Orders table:**
- Columns already use snake_case

## Rollback

If you need to rollback this migration, reverse all the ALTER TABLE commands:

```sql
-- Example rollback for users table
ALTER TABLE users RENAME COLUMN user_id TO "userId";
ALTER TABLE users RENAME COLUMN first_name TO "firstName";
-- ... etc
```
