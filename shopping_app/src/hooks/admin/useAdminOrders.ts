import { useState, useEffect } from 'react';
import { getAllOrdersForAdmin, updateOrderStatus, deleteOrderAdmin } from '../../services/orderAdminService';
import { type Order } from '../../types/order';
import { useToast } from '../useToast';

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);
  const { toasts, showToast, removeToast } = useToast();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrdersForAdmin();
      if (data && Array.isArray(data)) {
        setOrders(data);
      } else if (data && 'orders' in data) {
        setOrders((data as { orders: Order[] }).orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      showToast('שגיאה בטעינת הזמנות', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(orderId, newStatus);
      showToast(`סטטוס הזמנה #${orderId} עודכן בהצלחה`, 'success');
      await loadOrders();
    } catch (error) {
      showToast('שגיאה בעדכון הסטטוס', 'danger');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את ההזמנה? פעולה זו אינה ניתנת לביטול.')) {
      return;
    }
    try {
      setDeletingOrderId(orderId);
      await deleteOrderAdmin(orderId);
      showToast(`הזמנה #${orderId} נמחקה בהצלחה`, 'success');
      setOrders(prev => prev.filter(order => order.order_id !== orderId));
    } catch (error) {
      showToast('שגיאה במחיקת ההזמנה', 'danger');
    } finally {
      setDeletingOrderId(null);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  // חישובים
  const totalRevenue = orders.reduce((sum, order) =>
    order.status !== 'cancelled' ? sum + Number(order.total_amount) : sum, 0
  );
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const shippedOrders = orders.filter((o) => o.status === 'shipped').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;

  return {
    orders, loading, updatingOrderId, deletingOrderId, toasts, removeToast,
    totalRevenue, pendingOrders, shippedOrders, deliveredOrders, cancelledOrders,
    loadOrders, handleStatusChange, handleDeleteOrder
  };
};