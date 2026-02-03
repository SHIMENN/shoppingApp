import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaUserShield, FaUser, FaGoogle } from 'react-icons/fa';

interface Props {
  totalUsers: number;
  adminCount: number;
  regularCount: number;
  googleCount: number;
}

const UserStats: React.FC<Props> = ({ totalUsers, adminCount, regularCount, googleCount }) => (
  <Row className="mb-4 g-3">
    {[
      { label: 'סה"כ משתמשים', val: totalUsers, icon: <FaUsers className="text-primary" />, bg: 'primary' },
      { label: 'מנהלים', val: adminCount, icon: <FaUserShield className="text-danger" />, bg: 'danger' },
      { label: 'משתמשים רגילים', val: regularCount, icon: <FaUser className="text-success" />, bg: 'success' },
      { label: 'חשבונות Google', val: googleCount, icon: <FaGoogle className="text-info" />, bg: 'info' },
    ].map((item, idx) => (
      <Col md={3} sm={6} key={idx}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className={`rounded-circle bg-${item.bg} bg-opacity-10 p-3 me-3`}>
              {item.icon}
            </div>
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

export default UserStats;
