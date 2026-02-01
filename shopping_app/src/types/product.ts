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
  deletedProducts: Product[];
  total: number;       // סך כל המוצרים ב-DB
  totalPages: number;  // כמות העמודים הכוללת
  currentPage: number; // העמוד הנוכחי
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  loadProducts: (page?: number, limit?: number) => Promise<void>;
  loadDeletedProducts: () => Promise<void>;
  addProduct: (product: FormData) => Promise<void>;
  updateProduct: (product_id: number, product: FormData) => Promise<void>;
  deleteProduct: (product_id: number) => Promise<void>;
  restoreProduct: (product_id: number) => Promise<void>;
  clearError: () => void;
}
