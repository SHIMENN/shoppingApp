import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaBan } from 'react-icons/fa';

interface Props {
  revenue: number;
  cancelledCount: number;
}

const AdminOrderRevenue: React.FC<Props> = ({ revenue, cancelledCount }) => (
  <Row className="mb-4 g-3">
    <Col md={6}>
      <Card className="border-0 shadow-sm bg-light">
        <Card.Body className="py-3 d-flex justify-content-between align-items-center">
          <span className="text-muted">סה"כ הכנסות (ללא ביטולים)</span>
          <span className="fw-bold fs-4 text-success">₪{revenue.toFixed(2)}</span>
        </Card.Body>
      </Card>
    </Col>
    <Col md={6}>
      <Card className="border-0 shadow-sm bg-light">
        <Card.Body className="py-3 d-flex justify-content-between align-items-center">
          <span className="text-muted d-flex align-items-center"><FaBan className="me-2 text-danger" /> הזמנות שבוטלו</span>
          <span className="fw-bold fs-4">{cancelledCount}</span>
        </Card.Body>
      </Card>
    </Col>
  </Row>
);

export default AdminOrderRevenue;