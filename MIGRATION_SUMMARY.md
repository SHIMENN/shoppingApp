# סיכום שינויים - מיגרציה ל-snake_case

תאריך: 20/01/2026

## מטרת השינוי

המרת שמות עמודות בבסיס הנתונים מ-camelCase ל-snake_case כדי לעמוד בסטנדרט SQL/PostgreSQL.

## שינויים בשרת (Backend)

### 📁 קבצי Entity שעודכנו

**סה"כ:** 6 קבצי Entity

#### 1. User Entity
**קובץ:** `shopping_server/src/users/entities/user.entity.ts`

| שדה TypeScript | שם עמודה לפני | שם עמודה אחרי |
|---------------|---------------|---------------|
| userId | userId | user_id |
| firstName | firstName | first_name |
| lastName | lastName | last_name |
| googleId | googleId | google_id |
| createdAt | createdAt | created_at |
| username | username | username |
| email | email | email |
| password | password | password |
| role | role | role |
| provider | provider | provider |
| picture | picture | picture |

#### 2. Product Entity
**קובץ:** `shopping_server/src/products/entities/product.entity.ts`

| שדה TypeScript | שם עמודה לפני | שם עמודה אחרי |
|---------------|---------------|---------------|
| productId | productId | product_id |
| imageUrl | imageUrl | image_url |
| name | name | name |
| description | description | description |
| price | price | price |
| stock | stock | stock |

#### 3. Cart Entity
**קובץ:** `shopping_server/src/carts/entities/cart.entity.ts`

| שדה TypeScript | שם עמודה לפני | שם עמודה אחרי |
|---------------|---------------|---------------|
| cartId | cartId | cart_id |
| createdAt | createdAt | created_at |
| userUserId | userUserId | user_user_id |

#### 4. CartItem Entity
**קובץ:** `shopping_server/src/cart-item/entities/cart-item.entity.ts`

| שדה TypeScript | שם עמודה לפני | שם עמודה אחרי |
|---------------|---------------|---------------|
| cartItemId | cartItemId | cart_item_id |
| cartCartId | cartCartId | cart_cart_id |
| productId | productId | product_id |
| quantity | quantity | quantity |

**שינוי נוסף:** שם הטבלה `cart items` → `cart_items`

#### 5. Order Entity
**קובץ:** `shopping_server/src/orders/entities/order.entity.ts`

| שדה TypeScript | שם עמודה לפני | שם עמודה אחרי |
|---------------|---------------|---------------|
| order_id | order_id | order_id |
| user_id | user_id | user_id |
| order_date | order_date | order_date |
| total_amount | total_amount | total_amount |
| status | status | status |

**הערה:** הטבלה כבר הייתה עם snake_case, רק וידאנו עקביות

#### 6. OrderItem Entity
**קובץ:** `shopping_server/src/order-item/entities/order-item.entity.ts`

| שדה TypeScript | שם עמודה לפני | שם עמודה אחרי |
|---------------|---------------|---------------|
| order_item_id | orderitemid | order_item_id |
| order_id | orderid | order_id |
| product_id | productid | product_id |
| quantity | quantity | quantity |
| price | price | price |

**שינוי נוסף:** שם הטבלה `orderitems` → `order_items` (אם נדרש)

### 📄 קבצים חדשים שנוצרו

1. **`shopping_server/migrations/rename_columns_to_snake_case.sql`**
   - סקריפט SQL המבצע את שינוי שמות העמודות

2. **`shopping_server/migrations/run-migration.sh`**
   - סקריפט bash אוטומטי להרצת המיגרציה
   - כולל בדיקות אבטחה ואישורים

3. **`shopping_server/migrations/README.md`**
   - תיעוד מלא של המיגרציות
   - הוראות הרצה ו-rollback

4. **`shopping_server/MIGRATION_GUIDE.md`**
   - מדריך מפורט למיגרציה
   - פתרונות לבעיות נפוצות
   - שאלות ותשובות

## שינויים בקליינט (Frontend)

❌ **אין צורך בשינויים בקליינט**

הסיבה: הקליינט עובד עם JSON objects שמגיעים מה-API, ו-TypeORM מתרגם אוטומטית בין:
- שמות camelCase של TypeScript (במודלים)
- שמות snake_case של SQL (בבסיס הנתונים)

הקליינט ממשיך לקבל:
```json
{
  "userId": 1,
  "firstName": "John",
  "lastName": "Doe"
}
```

## כיצד לבצע את המיגרציה?

### אופציה 1: סקריפט אוטומטי (מומלץ)
```bash
cd shopping_server/migrations
./run-migration.sh
```

### אופציה 2: ידנית
```bash
cd shopping_server/migrations
psql -U postgres -d shopping_db -f rename_columns_to_snake_case.sql
```

## השפעה על הקוד הקיים

### ✅ ללא שינוי:
- כל הקוד של TypeScript (services, controllers, DTOs)
- הקוד של הקליינט
- ה-API endpoints
- ה-JSON responses

### ✏️ עודכן:
- קבצי Entity בלבד (הוספת `name` property לדקורטורים)
- בסיס הנתונים (שמות עמודות)

## דוגמאות לקוד

### לפני:
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  firstName: string;
}
```

### אחרי:
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'first_name' })
  firstName: string;
}
```

**הערה:** הקוד של TypeScript נשאר זהה - רק הוספנו את `name` property.

## בדיקות מומלצות לאחר המיגרציה

### 1. בדיקות בסיסיות
- [ ] התחברות למערכת
- [ ] רישום משתמש חדש
- [ ] צפייה ברשימת מוצרים
- [ ] הוספת מוצר לעגלה
- [ ] עדכון כמות בעגלה
- [ ] הסרת מוצר מהעגלה
- [ ] ביצוע הזמנה
- [ ] צפייה בהזמנות

### 2. בדיקות ניהול (Admin)
- [ ] התחברות כמנהל
- [ ] הוספת מוצר חדש
- [ ] עדכון מוצר קיים
- [ ] מחיקת מוצר
- [ ] צפייה בכל ההזמנות

### 3. בדיקות טכניות
- [ ] בדיקת לוגים של NestJS
- [ ] בדיקת queries ב-PostgreSQL logs
- [ ] בדיקת שמות עמודות בבסיס הנתונים:
  ```sql
  \d users
  \d products
  \d carts
  \d cart_items
  ```

## סטטיסטיקות

- **קבצי Entity שעודכנו:** 6
- **עמודות ששונו שמן:** 13 (Users: 5, Products: 2, Carts: 3, CartItems: 3)
- **טבלאות שהושפעו:** 6 (users, products, carts, cart_items, orders, order_items)
- **שמות טבלאות שתוקנו:** 2 (`cart items` → `cart_items`, `orderitems` → `order_items`)
- **שינויים בקוד היישום:** 0
- **קבצים חדשים שנוצרו:** 4

## Timeline המומלץ

1. **שלב פיתוח (Dev)** - כבר בוצע ✅
   - עדכון קבצי Entity
   - יצירת סקריפט מיגרציה
   - תיעוד

2. **שלב בדיקות (Testing)** - המשך
   - הרצת מיגרציה בסביבת בדיקות
   - בדיקות פונקציונליות מלאות
   - בדיקת ביצועים

3. **שלב הכנה לייצור (Pre-Production)**
   - יצירת גיבוי מלא
   - הכנת תוכנית rollback
   - תכנון חלון תחזוקה

4. **שלב ייצור (Production)**
   - הרצת מיגרציה
   - אימות מיידי
   - ניטור

## קישורים לקבצים

### שרת
- [User Entity](shopping_server/src/users/entities/user.entity.ts)
- [Product Entity](shopping_server/src/products/entities/product.entity.ts)
- [Cart Entity](shopping_server/src/carts/entities/cart.entity.ts)
- [CartItem Entity](shopping_server/src/cart-item/entities/cart-item.entity.ts)
- [Order Entity](shopping_server/src/orders/entities/order.entity.ts)
- [OrderItem Entity](shopping_server/src/order-item/entities/order-item.entity.ts)

### מיגרציה
- [SQL Migration Script](shopping_server/migrations/rename_columns_to_snake_case.sql)
- [Migration Runner Script](shopping_server/migrations/run-migration.sh)
- [Migration README](shopping_server/migrations/README.md)
- [Migration Guide](shopping_server/MIGRATION_GUIDE.md)

## תמיכה ובעיות

אם נתקלת בבעיות:
1. עיין ב-[MIGRATION_GUIDE.md](shopping_server/MIGRATION_GUIDE.md)
2. בדוק את הלוגים של NestJS והמסד נתונים
3. בצע rollback אם נדרש (הוראות במדריך)

---

**סטטוס:** ✅ המיגרציה מוכנה להרצה
**גרסה:** 1.0
**תאריך עדכון אחרון:** 20/01/2026