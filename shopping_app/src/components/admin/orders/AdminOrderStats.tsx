import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaClock, FaTruck, FaCheckCircle, FaReceipt } from 'react-icons/fa';

interface Props {
  totalOrders: number;
  pending: number;
  shipped: number;
  delivered: number;
}

const AdminOrderStats: React.FC<Props> = ({ totalOrders, pending, shipped, delivered }) => (
  <Row className="mb-4 g-3">
    {[
      { label: 'סה"כ הזמנות', val: totalOrders, icon: <FaReceipt className="text-primary" />, bg: 'primary' },
      { label: 'ממתינות לטיפול', val: pending, icon: <FaClock className="text-warning" />, bg: 'warning' },
      { label: 'בדרך ללקוח', val: shipped, icon: <FaTruck className="text-info" />, bg: 'info' },
      { label: 'נמסרו', val: delivered, icon: <FaCheckCircle className="text-success" />, bg: 'success' },
    ].map((item, idx) => (
      <Col md={3} sm={6} key={idx}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className={`rounded-circle bg-${item.bg} bg-opacity-10 p-3 me-3`}>{item.icon}</div>
            <div>
              <div className="text-muted small">{item.label}</div>
              <div className="fw-bold fs-5">{item.val}</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);

export default AdminOrderStats;