/**
 * ממשק המוצר הבסיסי כפי שהוא מגיע מהשרת
 */
export interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
}

/**
 * ממשק עבור ניהול מצב המוצרים ב-Zustand (Store)
 */
export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  loadProducts: () => Promise<void>;
  addProduct: (product: FormData) => Promise<void>; // שינוי ל-FormData בגלל התמונות
  updateProduct: (product_id: number, product: FormData) => Promise<void>;
  deleteProduct: (product_id: number) => Promise<void>;
  clearError: () => void;
}
