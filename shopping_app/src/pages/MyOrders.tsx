import React from 'react';
import {  Card, Accordion, Button } from 'react-bootstrap';
import { FaRedo } from 'react-icons/fa';
import { OrderStatsCards, OrderAccordionItem } from '../components/orders';
import { useOrders } from '../hooks/useOrders';
import OrderLoading from '../components/orders/OrderLoading';
import OrderError from '../components/orders/OrderError';
import EmptyOrders from '../components/orders/EmptyOrders';

const MyOrders: React.FC = () => {
  const {
    orders, loading, error, deletingOrderId,
    totalSpent, pendingOrders, deliveredOrders,
    loadOrders, handleDeleteOrder
  } = useOrders();

  if (loading) return <OrderLoading />;
  if (error) return <OrderError message={error} onRetry={loadOrders} />;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">ההזמנות שלי</h2>
          <p className="text-muted mb-0">מעקב אחר הזמנות וסטטוס משלוחים</p>
        </div>
        <Button variant="outline-primary" size="sm" onClick={loadOrders}>
          <FaRedo className="me-1" /> רענן
        </Button>
      </div>

      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <>
          <OrderStatsCards
            totalOrders={orders.length}
            deliveredOrders={deliveredOrders}
            pendingOrders={pendingOrders}
          />

          <Card className="border-0 shadow-sm mb-4 bg-light">
            <Card.Body className="py-3">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">סה"כ הוצאות</span>
                <span className="fw-bold fs-4">₪{totalSpent.toFixed(2)}</span>
              </div>
            </Card.Body>
          </Card>

          <Accordion defaultActiveKey="0" className="mb-4">
            {orders.map((order, index) => (
              <OrderAccordionItem
                key={order.order_id}
                order={order}
                eventKey={String(index)}
                onDelete={handleDeleteOrder}
                isDeleting={deletingOrderId === order.order_id}
              />
            ))}
          </Accordion>
        </>
      )}
    </>
  );
};

export default MyOrders;