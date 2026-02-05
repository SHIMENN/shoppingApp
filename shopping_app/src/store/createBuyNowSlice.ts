import { type StateCreator } from 'zustand';
import { type CartState, type CartItem } from '../types/cart';
import { type Product } from '../types/product';
import { useAuthStore } from './useAuthStore';
import api from '../services/api';

export interface BuyNowSlice {
    isBuyNowMode: boolean;
    savedCart: CartItem[];
    startBuyNow: (product: Product) => Promise<void>;
    cancelBuyNow: () => Promise<void>;
}

export const createBuyNowSlice: StateCreator<
    CartState,
    [],
    [],
    BuyNowSlice
> = (set, get) => ({
    isBuyNowMode: false,
    savedCart: [],

    startBuyNow: async (product: Product) => {
        const { isAuthenticated } = useAuthStore.getState();
        const currentCart = get().cart;

        // 1. שמירת העגלה הנוכחית
        set({
            savedCart: currentCart,
            isBuyNowMode: true,
            // מאפסים את העגלה למוצר היחיד
            cart: [{
                product,
                quantity: 1,
                cart_item_id: Date.now(),
                product_id: product.product_id,
                cart_cart_id: 0,
            }]
        });

        // 2. אם מחובר, מנקים את העגלה בשרת ושולחים את הפריט הבודד
        if (isAuthenticated) {
            try {
                // ניקוי מלא של השרת
                await api.delete('/cart');

                // הוספת הפריט הבודד
                await api.post('/cart', {
                    productId: product.product_id,
                    quantity: 1,
                });
            } catch (error) {
                console.error('Failed to setup Buy Now on server', error);
            }
        }
    },

    cancelBuyNow: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        const savedCart = get().savedCart;

        // 1. שחזור העגלה המקורית
        set({
            cart: savedCart,
            savedCart: [],
            isBuyNowMode: false
        });

        // 2. סנכרון מחדש מול השרת
        if (isAuthenticated) {
            try {
                // קודם מנקים את "עגלת הקנייה המיידית" מהשרת
                await api.delete('/cart');

                // ואז מסנכרנים חזרה את העגלה המקורית (אפשר לייעל אם syncCartWithServer יודע לעשות זאת)
                // במקרה הזה נשתמש בפונקציה הקיימת ב-Store הראשי דרך get()
                get().syncCartWithServer();
            } catch (error) {
                console.error('Failed to restore cart on server', error);
            }
        }
    },
});
