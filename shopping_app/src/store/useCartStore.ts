import { create } from 'zustand';
import { type CartState } from '../types/cart';
import api from '../services/api';

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  loading: false,
  error: null,

  /**
   * טעינת עגלת הקניות מהשרת
   */
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/cart');
      console.log('fetchCart response:', response.data);
      console.log('fetchCart cartItems:', response.data.cartItems);
      console.log('Type of cartItems:', typeof response.data.cartItems);
      console.log('Is array:', Array.isArray(response.data.cartItems));
      set({ cart: response.data.cartItems || [] });
      console.log('State updated. cart length:', response.data.cartItems?.length);
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      set({ error: 'שגיאה בטעינת העגלה' });
    } finally {
      set({ loading: false });
    }
  },

  /**
   * הוספת מוצר לעגלה
   */
  addToCart: async (product) => {
    const existingItem = get().cart.find(item => item.product.product_id === product.product_id);

    // Optimistic update
    if (existingItem) {
      set((state) => ({
        cart: state.cart.map(item =>
          item.product.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }));
    } else {
      set((state) => ({
        cart: [...state.cart, { product, quantity: 1, cart_item_id: Date.now(), product_id: product.product_id, cart_cart_id: 0 }],
      }));
    }

    try {
      const response = await api.post('/cart', {
        productId: product.product_id,
        quantity: 1,
      });
      console.log('addToCart response:', response.data);
      console.log('addToCart response JSON:', JSON.stringify(response.data, null, 2));
      console.log('addToCart cartItems:', response.data.cartItems);
      console.log('addToCart cartItems length:', response.data.cartItems?.length);
      set({ cart: response.data.cartItems || [] });
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      set({ error: 'שגיאה בהוספת מוצר לעגלה' });
      await get().fetchCart();
    }
  },

  /**
   * הסרת מוצר מהעגלה לגמרי
   */
  removeFromCart: async (product_id) => {
    const previousCart = get().cart;

    // Optimistic update
    set((state) => ({
      cart: state.cart.filter((item) => item.product.product_id !== product_id),
    }));

    try {
      await api.delete(`/cart/${product_id}`);
    } catch (error) {
      console.error("Error removing from cart:", error);
      set({ error: 'שגיאה בהסרת מוצר מהעגלה', cart: previousCart });
    }
  },

  /**
   * עדכון כמות של מוצר בעגלה
   */
  updateQuantity: async (product_id, quantity) => {
    if (quantity <= 0) {
      return get().removeFromCart(product_id);
    }

    const previousCart = get().cart;

    // Optimistic update
    set((state) => ({
      cart: state.cart.map(item =>
        item.product.product_id === product_id
          ? { ...item, quantity }
          : item
      ),
    }));

    try {
      const response = await api.patch(`/cart/${product_id}/quantity`, { quantity });
      console.log('updateQuantity response:', response.data);
      set({ cart: response.data.cartItems || [] });
    } catch (error) {
      console.error("Error updating quantity:", error);
      set({ error: 'שגיאה בעדכון כמות', cart: previousCart });
    }
  },

  /**
   * ריקון העגלה לגמרי
   */
  clearCart: async () => {
    const previousCart = get().cart;

    // Optimistic update
    set({ cart: [] });

    try {
      await api.delete('/cart');
    } catch (error) {
      console.error("Error clearing cart:", error);
      set({ error: 'שגיאה בריקון העגלה', cart: previousCart });
    }
  },

  /**
   * חישוב סה"כ פריטים בעגלה
   */
  getTotalItems: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

  /**
   * חישוב סה"כ מחיר
   */
  getTotalPrice: () => get().cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),

  /**
   * ביצוע הזמנה (checkout)
   */
  checkout: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/orders/checkout');
      // ריקון העגלה לאחר הזמנה מוצלחת
      set({ cart: [], loading: false });
      return response.data;
    } catch (error) {
      console.error("Error during checkout:", error);
      set({ error: 'שגיאה בביצוע ההזמנה', loading: false });
      throw error;
    }
  },
}));
