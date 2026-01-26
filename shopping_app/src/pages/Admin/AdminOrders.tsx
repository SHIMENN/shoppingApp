import React from 'react';
import { Container, Accordion, Button, Spinner, Alert } from 'react-bootstrap';
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
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center"><Spinner animation="border" variant="primary" /><p className="mt-3 text-muted">טוען הזמנות...</p></div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" dir="rtl">
      <ToastNotification toasts={toasts} onClose={removeToast} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">ניהול הזמנות</h2>
          <p className="text-muted mb-0">צפייה ועדכון סטטוס הזמנות</p>
        </div>
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
    </Container>
  );
};

export default AdminOrders;