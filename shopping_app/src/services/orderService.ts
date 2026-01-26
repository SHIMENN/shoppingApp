import api from "./api";

// משיכת ההזמנות האישיות של המשתמש המחובר
export const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data.orders || [];
};

// מחיקת הזמנה (רק הזמנות שבוטלו או נמסרו)
export const deleteOrder = async (orderId: number) => {
  const response = await api.delete(`/orders/${orderId}`);
  return response.data;
};