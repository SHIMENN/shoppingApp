import { type Product } from '../types/product';

export interface CartItem {
  cart_item_id: number;
  product: Product;
  quantity: number;
  product_id: number;
  cart_cart_id: number;
}
export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (product_id: number) => void;
  updateQuantity: (product_id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
export interface CartState {
  cart: CartItem[];
  loading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (product_id: number) => Promise<void>;
  updateQuantity: (product_id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  checkout: () => Promise<any>;
}