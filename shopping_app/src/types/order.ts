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

export interface Order {
  order_id: number;
  user_id: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  order_date: string;
  items?: OrderItem[];
  user?: User;
}