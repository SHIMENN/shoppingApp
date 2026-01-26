import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaReceipt, FaCheckCircle, FaClock } from 'react-icons/fa';

interface OrderStatsCardsProps {
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
}

const OrderStatsCards: React.FC<OrderStatsCardsProps> = ({ totalOrders, deliveredOrders, pendingOrders }) => {
  return (
    <Row className="mb-4 g-3">
      <Col md={4}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
              <FaReceipt className="text-primary" size={20} />
            </div>
            <div>
              <div className="text-muted small">סה"כ הזמנות</div>
              <div className="fw-bold fs-5">{totalOrders}</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
              <FaCheckCircle className="text-success" size={20} />
            </div>
            <div>
              <div className="text-muted small">הזמנות שנמסרו</div>
              <div className="fw-bold fs-5">{deliveredOrders}</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
              <FaClock className="text-warning" size={20} />
            </div>
            <div>
              <div className="text-muted small">ממתינות לטיפול</div>
              <div className="fw-bold fs-5">{pendingOrders}</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default OrderStatsCards;
