import { useState, useEffect } from 'react';
import { getMyOrders, deleteOrder } from '../services/orderService';
import type { Order } from '../types/order';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();

      if (data && data.orders) {
        setOrders(data.orders);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }

      setError(null);
    } catch (err) {
      setError('שגיאה בטעינת ההזמנות');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את ההזמנה? פעולה זו אינה ניתנת לביטול.')) {
      return;
    }

    try {
      setDeletingOrderId(orderId);
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(order => order.order_id !== orderId));
    } catch (err) {
      setError('שגיאה במחיקת ההזמנה');
      console.error('Error deleting order:', err);
    } finally {
      setDeletingOrderId(null);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

  return {
    orders, loading, error, deletingOrderId,
    totalSpent, pendingOrders, deliveredOrders,
    loadOrders, handleDeleteOrder
  };
};