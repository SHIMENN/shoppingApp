// שירות הזמנות - לאדמין
import api from './api';

// משיכת כל ההזמנות במערכת - עבור אדמין בלבד [cite: 48]
export const getAllOrdersForAdmin = async () => {
  const response = await api.get('/orders/admin/all');
  return response.data;
};

// עדכון סטטוס של הזמנה ספציפית [cite: 49]
export const updateOrderStatus = async (orderId: number, status: string) => {
  const response = await api.patch(`/orders/${orderId}/status`, { status });
  return response.data;
};