/**
 * טיפוסים עבור עגלת הקניות - פריטים, props לקומפוננטות, ופרטי משלוח
 */

import { type Product } from './product';

// פריט בעגלה - מה שמגיע מהשרת
export interface CartItem {
  cart_item_id: number;
  product: Product;
  quantity: number;
  product_id: number;
  cart_cart_id: number;
}

// Props עבור קומפוננטת CartItem
export interface CartItemProps {
  item: CartItem;
}

// Props עבור קומפוננטת CartSummary
export interface CartSummaryProps {
  totalPrice: number;
  onClear: () => void;
  onCheckout: () => void;
  isLoading?: boolean;
}

// ממשק עבור פרטי המשלוח
export interface ShippingDetails {
  fullName: string;
  address: string;
  city: string;
  postalCode?: string;
  phone: string;
  notes?: string;
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
  
  // 2. עדכון חתימת הפונקציה לקבלת פרטי המשלוח
  checkout: (shippingDetails: ShippingDetails) => Promise<void>; 
  
  syncCartWithServer: () => Promise<void>;
}