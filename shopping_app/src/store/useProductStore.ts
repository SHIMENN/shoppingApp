import { create } from 'zustand';
import { fetchProducts } from '../services/productService';
import api from '../services/api';
import { type ProductState } from '../types/product';


export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  actionLoading: false,

  // טעינת כל המוצרים
  loadProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchProducts();
      set({ products: data, loading: false });
    } catch (err) {
      set({ 
        error: 'נכשלה טעינת המוצרים', 
        loading: false 
      });
      console.error('Error loading products:', err);
    }
  },

  // הוספת מוצר חדש
  addProduct: async (newProduct) => {
    set({ actionLoading: true, error: null });
    
    try {
      const response = await api.post('/products', newProduct);
      
      // עדכון הסטור עם המוצר החדש מהשרת
      set((state) => ({ 
        products: [...state.products, response.data],
        actionLoading: false 
      }));
    } catch (err) {
      console.error('שגיאה בהוספת מוצר:', err);
      set({ 
        error: 'שגיאה בהוספת מוצר',
        actionLoading: false 
      });
    }
  },

  // עדכון מוצר קיים
  updateProduct: async (id, updatedProduct) => {
    set({ actionLoading: true, error: null });
    
    // שמירת המצב הקודם
    const previousProducts = get().products;

    // Optimistic update
    set((state) => ({
      products: state.products.map(p => 
        p.product_id === id ? { ...p, ...updatedProduct } : p
      ),
    }));

    try {
      const response = await api.patch(`/products/${id}`, updatedProduct);
      
      // עדכון עם הנתונים מהשרת
      set((state) => ({
        products: state.products.map(p => 
          p.product_id === id ? response.data : p
        ),
        actionLoading: false
      }));
    } catch (err) {
      console.error('שגיאה בעדכון מוצר:', err);
      // rollback
      set({ 
        products: previousProducts,
        error: 'שגיאה בעדכון מוצר',
        actionLoading: false 
      });
    }
  },

  // מחיקת מוצר
  deleteProduct: async (id) => {
    set({ actionLoading: true, error: null });
    
    // שמירת המצב הקודם ל-rollback
    const previousProducts = get().products;

    // Optimistic update - מחיקה מיידית בממשק
    set((state) => ({
      products: state.products.filter((p) => p.product_id !== id),
    }));

    try {
      await api.delete(`/products/${id}`);
      set({ actionLoading: false });
    } catch (err) {
      console.error('שגיאה במחיקת מוצר:', err);
      // rollback - החזרת המוצר
      set({ 
        products: previousProducts,
        error: 'שגיאה במחיקת מוצר',
        actionLoading: false 
      });
    }
  },

  // ניקוי שגיאות
  clearError: () => set({ error: null }),
}));