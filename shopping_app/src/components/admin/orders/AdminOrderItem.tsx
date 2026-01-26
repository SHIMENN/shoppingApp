import React from 'react';
import { Accordion, Row, Col, Badge, Table, Form, Button, Card } from 'react-bootstrap';
import { FaClock, FaShippingFast, FaCheckCircle, FaTimesCircle, FaBox, FaUser, FaEnvelope, FaMapMarkerAlt,FaTrash } from 'react-icons/fa';
import {type Order } from '../../../types/order';

interface Props {
  order: Order;
  index: number;
  updatingOrderId: number | null;
  deletingOrderId: number | null;
  onStatusChange: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

const AdminOrderItem: React.FC<Props> = ({ order, index, updatingOrderId, deletingOrderId, onStatusChange, onDelete }) => {
  const getStatusInfo = (status: string) => {
    const statusMap: any = {
      pending: { bg: 'warning', text: 'ממתין לטיפול', icon: <FaClock />, color: '#f0ad4e' },
      shipped: { bg: 'info', text: 'נשלח', icon: <FaShippingFast />, color: '#5bc0de' },
      delivered: { bg: 'success', text: 'נמסר', icon: <FaCheckCircle />, color: '#5cb85c' },
      cancelled: { bg: 'danger', text: 'בוטל', icon: <FaTimesCircle />, color: '#d9534f' },
    };
    return statusMap[status] || { bg: 'secondary', text: status, icon: <FaBox />, color: '#6c757d' };
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <Accordion.Item eventKey={String(index)} className="border-0 shadow-sm mb-3 rounded overflow-hidden">
      <Accordion.Header>
        <div className="d-flex justify-content-between align-items-center w-100 pe-3">
          <div className="d-flex align-items-center">
            <div className="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" 
                 style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color, width: 40, height: 40 }}>
              {statusInfo.icon}
            </div>
            <div>
              <div className="fw-bold">הזמנה #{order.order_id}</div>
              <small className="text-muted">{new Date(order.order_date).toLocaleDateString('he-IL')}</small>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <Badge bg={statusInfo.bg} className="px-3 py-2">{statusInfo.text}</Badge>
            <span className="fw-bold text-success">₪{Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>
      </Accordion.Header>
      <Accordion.Body className="bg-white">
        <Row>
          <Col md={6}>
            <div className="bg-light rounded p-3 mb-3">
              <h6 className="fw-bold mb-2 d-flex align-items-center"><FaUser className="me-2 text-primary" /> פרטי לקוח</h6>
              <strong>{order.user?.user_name || 'לא זמין'}</strong>
              {order.user?.email && <div className="text-muted small"><FaEnvelope className="me-2" />{order.user.email}</div>}
            </div>
            {order.shipping_address && (
              <div className="bg-light rounded p-3 mb-3">
                <h6 className="fw-bold mb-2 d-flex align-items-center"><FaMapMarkerAlt className="me-2 text-primary" /> כתובת משלוח</h6>
                <div>{order.shipping_address}</div>
              </div>
            )}
            <Card className="border-0 bg-light p-3">
              <h6 className="fw-bold mb-3">עדכון סטטוס / פעולות</h6>
              <Form.Select value={order.status} onChange={(e) => onStatusChange(order.order_id, e.target.value)} disabled={updatingOrderId === order.order_id}>
                <option value="pending">ממתין לטיפול</option>
                <option value="shipped">נשלח</option>
                <option value="delivered">נמסר</option>
                <option value="cancelled">בוטל</option>
              </Form.Select>
              <Button variant="outline-danger" size="sm" className="w-100 mt-3" onClick={() => onDelete(order.order_id)} disabled={deletingOrderId === order.order_id}>
                <FaTrash className="me-1" /> מחק הזמנה
              </Button>
            </Card>
          </Col>
          <Col md={6}>
            <h6 className="fw-bold mb-3">פריטים בהזמנה</h6>
            <Table responsive hover size="sm">
              <thead className="bg-light"><tr><th>מוצר</th><th>כמות</th><th>מחיר</th><th>סה"כ</th></tr></thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.order_item_id}>
                    <td>{item.product?.name || 'מוצר'}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-muted">₪{Number(item.price).toFixed(2)}</td>
                    <td className="fw-bold">₪{(Number(item.price) * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default AdminOrderItem;