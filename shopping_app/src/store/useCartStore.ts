import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type CartState, type CartItem, type ShippingDetails } from '../types/cart';
import { type Product } from '../types/product';
import api from '../services/api';
import { useAuthStore } from './useAuthStore';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      loading: false,
      error: null,

      // טעינת עגלה מהשרת
      fetchCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;
        set({ loading: true, error: null });
        try {
          const response = await api.get('/cart');
          set({ cart: response.data.cartItems || [], loading: false });
        } catch (error) {
          set({ error: 'שגיאה בטעינת העגלה', loading: false });
        }
      },

      // הוספה לעגלה
      addToCart: async (product: Product) => {
        const { isAuthenticated } = useAuthStore.getState();
        const currentCart = get().cart;
        const existingItem = currentCart.find(
          (item: CartItem) => item.product.product_id === product.product_id
        );
        
        let updatedCart: CartItem[];
        if (existingItem) {
          updatedCart = currentCart.map((item: CartItem) =>
            item.product.product_id === product.product_id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedCart = [...currentCart, {
            product,
            quantity: 1,
            cart_item_id: Date.now(),
            product_id: product.product_id,
            cart_cart_id: 0,
          }];
        }

        set({ cart: updatedCart });

        if (isAuthenticated) {
          try {
            const response = await api.post('/cart', {
              productId: product.product_id,
              quantity: 1,
            });
            set({ cart: response.data.cartItems || [] });
          } catch (error) {
            console.error('Failed to sync add to DB', error);
          }
        }
      },

      // הסרה מהעגלה
      removeFromCart: async (product_id: number) => {
        const { isAuthenticated } = useAuthStore.getState();
        set((state) => ({
          cart: state.cart.filter((item) => item.product.product_id !== product_id),
        }));
        if (isAuthenticated) {
          try {
            await api.delete(`/cart/${product_id}`);
          } catch (e) {
            console.error(e);
          }
        }
      },

      // עדכון כמות
      updateQuantity: async (product_id: number, quantity: number) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (quantity <= 0) return get().removeFromCart(product_id);

        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.product_id === product_id ? { ...item, quantity } : item
          ),
        }));

        if (isAuthenticated) {
          try {
            const response = await api.patch(`/cart/${product_id}/quantity`, { quantity });
            set({ cart: response.data.cartItems || [] });
          } catch (e) {
            console.error(e);
          }
        }
      },

      // סנכרון מול השרת (אחרי לוגין)
      syncCartWithServer: async () => {
        const localCart = get().cart;
        if (localCart.length === 0) return get().fetchCart();
        try {
          for (const item of localCart) {
            await api.post('/cart', {
              productId: item.product?.product_id || item.product_id,
              quantity: item.quantity,
            });
          }
          await get().fetchCart();
        } catch (error) {
          console.error('Error syncing cart', error);
        }
      },

      // ניקוי עגלה
      clearCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        set({ cart: [] });
        if (isAuthenticated) {
          try {
            await api.delete('/cart');
          } catch (e) {
            console.error(e);
          }
        }
      },

      getTotalItems: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () =>
        get().cart.reduce(
          (sum, item) => sum + Number(item.product.price) * item.quantity,
          0
        ),

      // ביצוע הזמנה סופי
      checkout: async (shippingDetails: ShippingDetails) => {
        set({ loading: true, error: null });
        try {
          // פורמט כתובת המשלוח כטקסט מלא
          const shipping_address = `${shippingDetails.fullName}, ${shippingDetails.address}, ${shippingDetails.city}${shippingDetails.postalCode ? ` ${shippingDetails.postalCode}` : ''}, טלפון: ${shippingDetails.phone}`;

          const response = await api.post('/orders/checkout', {
            shipping_address,
            notes: shippingDetails.notes || undefined
          });

          set({ cart: [], loading: false });
          return response.data;
        } catch (e) {
          set({ loading: false, error: 'נכשלה ביצוע ההזמנה' });
          throw e;
        }
      },
    }),
    { name: 'cart-storage' }
  )
);