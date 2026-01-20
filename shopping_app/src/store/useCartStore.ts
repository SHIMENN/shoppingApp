import { create } from 'zustand';
import { type CartState } from '../types/cart';
import api from '../services/api';


export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/cart');
      // נניח והשרת מחזיר אובייקט עם מערך בשם items
      set({ cart: response.data.items || [] });
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      set({ loading: false });
    }
  },

  // פעולות (Actions)
      addToCart: async(product) => {
        try{
        const response = await api.post('/carts/', {
            productId: product.id,
            quantity: 1,
          });
        set({ cart: response.data.items });
       } catch (error) {
       console.error("Error adding to cart:", error);
        }
         },

      removeFromCart: async (productId) => {
    try {
      await api.delete(`/carts/${productId}`);
      // עדכון מקומי מהיר אחרי שהשרת אישר
      set((state) => ({
        cart: state.cart.filter((item) => item.product.id !== productId),
      }));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  },

     updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) return get().removeFromCart(productId);
    
    try {
      const response = await api.patch(`/cart/${productId}`, { quantity });
      set({ cart: response.data.items });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  },

      clearCart: async () => {
    try {
      await api.delete('/cart');
      set({ cart: [] });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  },
      // חישובים מהירים
   getTotalItems: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
  getTotalPrice: () => get().cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
}));