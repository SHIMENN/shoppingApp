// src/pages/Admin/AdminOrders.tsx
import React, { useEffect, useState } from 'react';
import { Container, Table, Form, Badge, Spinner } from 'react-bootstrap';
import { getAllOrdersForAdmin, updateOrderStatus } from '../../services/orderAdminService';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getAllOrdersForAdmin();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadOrders(); // רענון הרשימה לאחר העדכון [cite: 49]
    } catch (error) {
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="mt-4 text-end">
      <h2 className="mb-4">ניטור הזמנות מערכת</h2>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th># מזהה</th>
            <th>לקוח</th>
            <th>תאריך</th>
            <th>סה"כ</th>
            <th>סטטוס</th>
            <th>עדכון סטטוס</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.user?.username}</td>
              <td>{new Date(order.order_date).toLocaleDateString()}</td>
              <td>₪{order.total_amount}</td>
              <td>
                <Badge bg={order.status === 'delivered' ? 'success' : 'warning'}>
                  {order.status}
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
    </Container>
  );
};

export default AdminOrders;