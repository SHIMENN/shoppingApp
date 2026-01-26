import api from './api';
import {type Order } from '../types/order';

/**
 * משיכת כל ההזמנות במערכת (עבור פאנל ניהול)
 */
export const getAllOrdersForAdmin = async (): Promise<Order[]> => {
  const response = await api.get('/orders/admin/all');
  return response.data;
};

/**
 * עדכון סטטוס הזמנה (pending, shipped, delivered, cancelled)
 */
export const updateOrderStatus = async (orderId: number, status: string): Promise<Order> => {
  const response = await api.patch(`/orders/admin/${orderId}/status`, { status });
  return response.data;
};

/**
 * מחיקת הזמנה (אדמין בלבד)
 */
export const deleteOrderAdmin = async (orderId: number): Promise<{ message: string }> => {
  const response = await api.delete(`/orders/admin/${orderId}`);
  return response.data;
};