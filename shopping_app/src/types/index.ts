// src/types/index.ts

export interface User {
  username: string; // [cite: 74, 75]
  email: string; // [cite: 77, 78]
  isAdmin: boolean; // [cite: 82]
  role: 'user' | 'admin'; // [cite: 85]
}

export interface Product {
  name: string; // [cite: 167]
  description: string; // [cite: 168]
  price: number; // [cite: 171, 172]
  stock: number; // [cite: 174]
  imageUrl?: string; // הוספה לצורך הצגת תמונה מ-Cloudinary/S3 [cite: 12]
  id: number; // [cite: 140]
}

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
// src/types/index.ts
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuthData: (userData: User, token: string) => void;
  login: (userData: User, token: string) => void; // חובה להוסיף את זה כאן!
  logout: () => void;
}