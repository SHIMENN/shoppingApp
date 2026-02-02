/**
 * טיפוסים עבור הזמנות - פריט בהזמנה והזמנה מלאה עם סטטוסים
 */

import type { Product } from './product';
import type { User } from './user';

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  order_id: number;
  user_id: number;
  status: OrderStatus;
  total_amount: number;
  order_date: string;
  shipping_address?: string;
  notes?: string;
  items?: OrderItem[];
  user?: User;
}