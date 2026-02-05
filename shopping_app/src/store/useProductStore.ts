import { create } from 'zustand';
import { AxiosError } from 'axios';
import { fetchProducts } from '../services/productService';
import api from '../services/api';
import { type ProductState } from '../types/product';

// עדכון ה-Store עם תמיכה בדפדופ וניהול שגיאות משופר
export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  deletedProducts: [],
  total: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  actionLoading: false,

  // טעינת מוצרים עם תמיכה בעמודים (Pagination)
  loadProducts: async (page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      // הקריאה ל-fetchProducts כעת מחזירה אובייקט עם data, total וכו'
      const response = await fetchProducts(page, limit);

      set({
        products: response.data, // המערך נמצא בתוך תת-שדה data
        total: response.total,
        totalPages: response.totalPages,
        currentPage: response.page,
        loading: false
      });
    } catch (error) {
      const err = error as AxiosError;
      const errorMessage = err.response?.status === 429
        ? 'יותר מדי בקשות. אנא המתן דקה ונסה שוב.'
        : 'נכשלה טעינת המוצרים';

      set({
        error: errorMessage,
        loading: false
      });
    }
  },

  // הוספת מוצר חדש (מקבל FormData בגלל התמונות)
  addProduct: async (newProduct: FormData) => {
    set({ actionLoading: true, error: null });
    try {
      const response = await api.post('/products', newProduct);

      // השרת מחזיר את המוצר החדש עם שדה 'id'
      set((state) => ({
        products: [...state.products, response.data],
        total: state.total + 1,
        actionLoading: false
      }));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({
        error: err.response?.data?.message || 'שגיאה בהוספת מוצר',
        actionLoading: false
      });
    }
  },

  // עדכון מוצר קיים
  updateProduct: async (id, updatedProduct: FormData) => {
    set({ actionLoading: true, error: null });
    const previousProducts = get().products;

    try {
      const response = await api.patch(`/products/${id}`, updatedProduct);

      set((state) => ({
        products: state.products.map(p =>
          p.product_id === id ? response.data : p
        ),
        actionLoading: false
      }));
    } catch {
      set({
        products: previousProducts, // Rollback במקרה של שגיאה
        error: 'שגיאה בעדכון מוצר',
        actionLoading: false
      });
    }
  },

  // מחיקת מוצר
  deleteProduct: async (id) => {
    set({ actionLoading: true, error: null });
    const previousProducts = get().products;

    // עדכון אופטימי (Optimistic Update)
    set((state) => ({
      products: state.products.filter((p) => p.product_id !== id),
    }));

    try {
      await api.delete(`/products/${id}`);
      set((state) => ({
        total: state.total - 1,
        actionLoading: false
      }));
    } catch {
      set({
        products: previousProducts,
        error: 'שגיאה במחיקת מוצר',
        actionLoading: false
      });
    }
  },

  // טעינת מוצרים מחוקים
  loadDeletedProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/products/deleted');
      set({
        deletedProducts: response.data.data,
        loading: false
      });
    } catch {
      set({
        error: 'שגיאה בטעינת מוצרים מחוקים',
        loading: false
      });
    }
  },

  // שחזור מוצר מחוק
  restoreProduct: async (id) => {
    set({ actionLoading: true, error: null });
    try {
      await api.patch(`/products/restore/${id}`);
      set((state) => ({
        deletedProducts: state.deletedProducts.filter((p) => p.product_id !== id),
        actionLoading: false
      }));
      // רענון רשימת המוצרים הפעילים - טען את כולם
      get().loadProducts(1, 1000);
    } catch {
      set({
        error: 'שגיאה בשחזור המוצר',
        actionLoading: false
      });
    }
  },

  clearError: () => set({ error: null }),
}));