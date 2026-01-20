import React, { useEffect, useState } from 'react';
import { Container, Table, Form, Badge, Spinner, Card } from 'react-bootstrap';
import { getAllOrdersForAdmin, updateOrderStatus } from '../../services/orderAdminService';
import { type Order } from '../../types/order';
import { useToast } from '../../hooks/useToast';
import ToastNotification from '../../components/common/ToastNotification';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrdersForAdmin();
      setOrders(data);
    } catch (error) {
      showToast('שגיאה בטעינת הזמנות', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`סטטוס הזמנה #${orderId} עודכן בהצלחה`, 'success');
      loadOrders(); // רענון הרשימה
    } catch (error) {
      showToast('שגיאה בעדכון הסטטוס', 'danger');
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="mt-4 text-end" dir="rtl">
      <ToastNotification toasts={toasts} onClose={removeToast} />
      <h2 className="mb-4 fw-bold">ניהול הזמנות מערכת 🛒</h2>
      
      <Card className="shadow-sm">
        <Table striped bordered hover responsive className="mb-0">
          <thead className="table-dark">
            <tr>
              <th>מזהה</th>
              <th>לקוח</th>
              <th>תאריך</th>
              <th>סה"כ</th>
              <th>סטטוס נוכחי</th>
              <th>פעולת עדכון</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>#{order.order_id}</td>
                <td>
                  <strong>{order.user?.user_name || 'לקוח'}</strong><br/>
                  <small className="text-muted">{order.user?.email}</small>
                </td>
                <td>{new Date(order.order_date).toLocaleDateString('he-IL')}</td>
                <td className="fw-bold text-success">₪{order.total_amount}</td>
                <td>
                  <Badge bg={
                    order.status === 'delivered' ? 'success' : 
                    order.status === 'pending' ? 'warning' : 'info'
                  }>
                    {order.status === 'pending' ? 'בהמתנה' : 
                     order.status === 'shipped' ? 'נשלח' : 
                     order.status === 'delivered' ? 'נמסר' : 'בוטל'}
                  </Badge>
                </td>
                <td>
                  <Form.Select 
                    size="sm" 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                  >
                    <option value="pending">בהמתנה</option>
                    <option value="shipped">נשלח</option>
                    <option value="delivered">נמסר</option>
                    <option value="cancelled">בוטל</option>
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default AdminOrders;