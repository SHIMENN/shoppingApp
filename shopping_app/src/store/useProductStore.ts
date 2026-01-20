import { create } from 'zustand';
import { type Product } from '../types/product';
import { fetchProducts } from '../services/productService';
import api from '../services/api';


interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;

  // פעולות (Actions)
  loadProducts: () => Promise<void>;
  addProduct: (product: any) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

  // טעינת כל המוצרים
  loadProducts: async () => {
    set({ loading: true });
    try {
      const data = await fetchProducts();
      set({ products: data, loading: false });
    } catch (err) {
      set({ error: 'נכשלה טעינת המוצרים', loading: false });
    }
  },

  // הוספת מוצר חדש
  addProduct: async (newProduct) => {
    try {
      const response = await api.post('/products', newProduct);
      // עדכון הסטור המקומי ללא צורך בקריאה נוספת לשרת (אופטימיזציה)
      set((state) => ({ products: [...state.products, response.data] }));
    } catch (err) {
      console.error('שגיאה בהוספת מוצר', err);
    }
  },

  // מחיקת מוצר
  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (err) {
      console.error('שגיאה במחיקת מוצר', err);
    }
  },
}));