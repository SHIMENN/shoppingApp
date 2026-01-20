import api from "./api";

// משיכת ההזמנות האישיות של המשתמש המחובר
export const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data.orders || [];
};