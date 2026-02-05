import React from 'react';
import { Accordion, Button, Spinner, Alert } from 'react-bootstrap';
import { FaRedo } from 'react-icons/fa';
import { useAdminOrders } from '../../hooks/admin/useAdminOrders';
import ToastNotification from '../../components/common/ToastNotification';
import AdminOrderStats from '../../components/admin/orders/AdminOrderStats';
import AdminOrderRevenue from '../../components/admin/orders/AdminOrderRevenue';
import AdminOrderItem from '../../components/admin/orders/AdminOrderItem';

const AdminOrders: React.FC = () => {
  const {
    orders, loading, updatingOrderId, deletingOrderId, toasts, removeToast,
    totalRevenue, pendingOrders, shippedOrders, deliveredOrders, cancelledOrders,
    loadOrders, handleStatusChange, handleDeleteOrder
  } = useAdminOrders();

  if (loading) {
    return (
        <div className="text-center"><Spinner animation="border" variant="primary" /><p className="mt-3 text-muted">טוען הזמנות...</p></div>
     
    );
  }

  return (
    <>
      <ToastNotification toasts={toasts} onClose={removeToast} />

      <div className="d-flex justify-content-end mb-4">
        <Button variant="outline-primary" size="sm" onClick={loadOrders}><FaRedo className="me-1" /> רענן</Button>
      </div>

      <AdminOrderStats 
        totalOrders={orders.length} 
        pending={pendingOrders} 
        shipped={shippedOrders} 
        delivered={deliveredOrders} 
      />

      <AdminOrderRevenue revenue={totalRevenue} cancelledCount={cancelledOrders} />

      {orders.length === 0 ? (
        <Alert variant="info">אין הזמנות להצגה</Alert>
      ) : (
        <Accordion className="mb-4">
          {orders.map((order, index) => (
            <AdminOrderItem 
              key={order.order_id}
              order={order}
              index={index}
              updatingOrderId={updatingOrderId}
              deletingOrderId={deletingOrderId}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteOrder}
            />
          ))}
        </Accordion>
      )}
    </>
  );
};

export default AdminOrders;