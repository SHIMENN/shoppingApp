import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { getMyOrders } from '../services/orderService';
// תיקון: שימוש ב-import type עבור הגדרת verbatimModuleSyntax
import type { Order } from '../types/order';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      
      /**
       * תיקון שגיאת ה-Pagination:
       * השרת מחזיר אובייקט { orders, total, page, totalPages }.
       * עלינו לשלוף את המערך מתוך השדה orders.
       */
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; icon: string }> = {
      pending: { bg: 'warning', text: 'ממתין לעיבוד', icon: '⏳' },
      shipped: { bg: 'info', text: 'נשלח', icon: '📦' },
      delivered: { bg: 'success', text: 'נמסר', icon: '✅' },
      cancelled: { bg: 'danger', text: 'בוטל', icon: '❌' },
    };

    const info = statusMap[status] || { bg: 'secondary', text: status, icon: '❓' };

    return (
      <Badge bg={info.bg} className="px-3 py-2">
        {info.icon} {info.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">טוען הזמנות...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="text-end">
          <h5>{error}</h5>
          <button className="btn btn-outline-danger mt-2" onClick={loadOrders}>
            נסה שוב
          </button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4 text-end" dir="rtl">
      <div className="mb-4">
        <h2 className="fw-bold mb-2">ההזמנות שלי 📋</h2>
        <p className="text-muted">צפה בהיסטוריית ההזמנות ומעקב אחר סטטוס המשלוח</p>
      </div>

      {orders.length === 0 ? (
        <Card className="shadow-sm text-center py-5">
          <Card.Body>
            <div className="display-1 mb-3">📦</div>
            <h4>עדיין לא ביצעת הזמנות</h4>
            <p className="text-muted mb-4">התחל לקנות עכשיו וצור את ההזמנה הראשונה שלך!</p>
            <a href="/" className="btn btn-primary">
              חזור לחנות
            </a>
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* Summary Stats */}
          <Row className="mb-4">
            <Col md={4} className="mb-3">
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <div className="text-primary display-6 mb-2">📊</div>
                  <h5>{orders.length}</h5>
                  <small className="text-muted">סה"כ הזמנות</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <div className="text-success display-6 mb-2">💰</div>
                  <h5>
                    ₪
                    {orders
                      .reduce((sum, order) => sum + Number(order.total_amount), 0)
                      .toFixed(2)}
                  </h5>
                  <small className="text-muted">סה"כ הוצאות</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <div className="text-warning display-6 mb-2">⏳</div>
                  <h5>
                    {orders.filter((o) => o.status === 'pending').length}
                  </h5>
                  <small className="text-muted">הזמנות ממתינות</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Orders List */}
          <div className="mb-4">
            {orders.map((order) => (
              <Card key={order.order_id} className="shadow-sm mb-3">
                <Card.Header className="bg-light">
                  <Row className="align-items-center">
                    <Col md={3}>
                      <strong>הזמנה #{order.order_id}</strong>
                    </Col>
                    <Col md={3}>
                      <small className="text-muted">
                        📅 {new Date(order.order_date).toLocaleDateString('he-IL')}
                      </small>
                    </Col>
                    <Col md={3}>{getStatusBadge(order.status)}</Col>
                    <Col md={3}>
                      <strong className="text-success">
                        ₪{Number(order.total_amount).toFixed(2)}
                      </strong>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  <Table responsive size="sm" className="text-end mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>מוצר</th>
                        <th className="text-center">כמות</th>
                        <th>מחיר ליחידה</th>
                        <th>סה"כ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item) => (
                        <tr key={item.order_item_id}>
                          <td className="fw-bold">{item.product?.name || 'מוצר'}</td>
                          <td className="text-center">
                            <Badge bg="secondary">{item.quantity}</Badge>
                          </td>
                          <td>₪{Number(item.price).toFixed(2)}</td>
                          <td className="fw-bold text-success">
                            ₪{(Number(item.price) * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            ))}
          </div>
        </>
      )}
    </Container>
  );
};

export default MyOrders;