import { type Product } from '../types/product';

export interface CartItem {
  cart_item_id: number; // [cite: 142]
  product: Product; // [cite: 150]
  quantity: number; // [cite: 153]

}
export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
export interface CartState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  loading: boolean;
  fetchCart: () => Promise<void>;
}
