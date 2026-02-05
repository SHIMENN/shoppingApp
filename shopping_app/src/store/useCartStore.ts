import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type CartState, type CartItem, type ShippingDetails } from '../types/cart';
import { type Product } from '../types/product';
import api from '../services/api';
import { useAuthStore } from './useAuthStore';
import { createBuyNowSlice } from './createBuyNowSlice';

// נעילה למניעת סנכרון כפול (React strict mode מריץ useEffect פעמיים)
let syncInProgress = false;

export const useCartStore = create<CartState>()(
  persist(
    (set, get, storeApi) => ({
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
        } catch {
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
        if (syncInProgress) return;
        syncInProgress = true;
        try {
          const localCart = get().cart;
          if (localCart.length === 0) return get().fetchCart();

          // קודם בודקים מה כבר קיים בשרת
          const serverResponse = await api.get('/cart');
          const serverItems = serverResponse.data.cartItems || [];

          // רק פריטים שלא קיימים בשרת יישלחו
          for (const item of localCart) {
            const productId = item.product?.product_id || item.product_id;
            const existsOnServer = serverItems.some(
              (serverItem: CartItem) => {
                const serverId = serverItem.product?.product_id || serverItem.product_id;
                const localId = item.product?.product_id || item.product_id;
                return String(serverId) === String(localId);
              }
            );
            if (!existsOnServer) {
              await api.post('/cart', {
                productId,
                quantity: item.quantity,
              });
            }
          }
          await get().fetchCart();
        } catch (error) {
          console.error('Error syncing cart', error);
        } finally {
          syncInProgress = false;
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

      ...createBuyNowSlice(set, get, storeApi),

      checkout: async (shippingDetails: ShippingDetails) => {
        set({ loading: true, error: null });
        const { isBuyNowMode, savedCart } = get();

        try {
          await get().syncCartWithServer();

          const shipping_address = `${shippingDetails.fullName}, ${shippingDetails.address}, ${shippingDetails.city}${shippingDetails.postalCode ? ` ${shippingDetails.postalCode}` : ''}, טלפון: ${shippingDetails.phone}`;

          const response = await api.post('/orders/checkout', {
            shipping_address,
            notes: shippingDetails.notes || undefined
          });

          // הצלחה!

          if (isBuyNowMode) {
            // במצב קנייה מיידית: משחזרים את העגלה המקורית כאילו לא קרה כלום (כי הפריטים המקוריים לא נקנו)
            const { isAuthenticated } = useAuthStore.getState();

            set({
              cart: savedCart,
              savedCart: [],
              isBuyNowMode: false,
              loading: false
            });

            if (isAuthenticated) {
              // שחזור הנתונים בשרת
              // הערה: ה-checkout בשרת כבר מנקה את העגלה, אז אנחנו רק צריכים לדחוף חזרה את savedCart
              // אבל syncCartWithServer מצפה שיש משהו בלוקלי ואין בשרת, אז זה אמור לעבוד
              get().syncCartWithServer();
            }
          } else {
            // במצב רגיל: מרוקנים את העגלה
            set({ cart: [], loading: false });
          }

          return response.data;
        } catch (e) {
          set({ loading: false, error: 'נכשלה ביצוע ההזמנה' });
          throw e;
        }
      },
    }),
    {
      name: 'cart-storage',
      // לא שומרים את מצב BuyNow ב-persist כדי למנוע מצב תקוע בריענון
      partialize: (state) => ({
        cart: state.isBuyNowMode ? state.savedCart : state.cart, // תמיד שומרים לדיסק את העגלה האמיתית!
        // אם אנחנו במצב BuyNow, ה-cart מכיל רק פריט אחד זמני, ואנחנו לא רוצים לדרוס את האחסון המקומי איתו.
        // אז אנחנו שומרים את savedCart (שהוא העגלה המקורית).
      }),
    }
  )
);