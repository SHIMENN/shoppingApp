export interface CartResponse {
  cart_id: number;
  created_at: Date;
  user_user_id: number;
  cartItems: CartItemWithProduct[];
  totalItems: number;
  totalPrice: number;
}

export interface CartItemWithProduct {
  cart_item_id: number;
  quantity: number;
  cart_cart_id: number;
  product_id: number;
  product: {
    product_id: number;
    id: number;
    name: string;
    price: number;
    image_url?: string;
    [key: string]: any;
  } | null;
}
