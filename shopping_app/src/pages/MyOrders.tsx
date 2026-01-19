// דף המציג את היסטוריית ההזמנות של המשתמש
import React, { useEffect, useState } from 'react';
import { Container, Accordion, Table, Badge, Spinner } from 'react-bootstrap';
import { getMyOrders } from '../services/orderService';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="mt-4 text-end">
      <h2 className="mb-4">היסטוריית ההזמנות שלי</h2>
      {orders.length === 0 ? (
        <p>עדיין לא ביצעת הזמנות באתר.</p>
      ) : (
        <Accordion defaultActiveKey="0">
          {orders.map((order, index) => (
            <Accordion.Item eventKey={index.toString()} key={order.order_id}>
              <Accordion.Header>
                <div className="d-flex justify-content-between w-100 ps-3">
                  <span>הזמנה #{order.order_id} - {new Date(order.order_date).toLocaleDateString()}</span>
                  <Badge bg={order.status === 'delivered' ? 'success' : 'warning'}>
                    סטטוס: {order.status}
                  </Badge>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <Table responsive size="sm" className="text-end">
                  <thead>
                    <tr>
                      <th>מוצר</th>
                      <th>כמות</th>
                      <th>מחיר ליחידה</th>
                      <th>סה"כ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* פירוט פריטי ההזמנה מתוך טבלת ORDERITEM ב-ERD [cite: 133] */}
                    {order.items?.map((item: any) => (
                      <tr key={item.order_item_id}>
                        <td>{item.product?.name}</td>
                        <td>{item.quantity}</td>
                        <td>₪{item.price}</td>
                        <td>₪{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="text-start fw-bold mt-2">
                  סה"כ לתשלום עבור ההזמנה: ₪{order.total_amount}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default MyOrders;