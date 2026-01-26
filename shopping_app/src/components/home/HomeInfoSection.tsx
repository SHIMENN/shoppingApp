import React from 'react';
import { Row, Col } from 'react-bootstrap';

const HomeInfoSection: React.FC = () => (
  <Row className="mt-5 py-5 bg-light rounded">
    <Col md={4} className="text-center mb-3">
      <div className="display-4 mb-2">🚚</div>
      <h5>משלוח מהיר</h5>
      <p className="text-muted">משלוח עד 3 ימי עסקים</p>
    </Col>
    <Col md={4} className="text-center mb-3">
      <div className="display-4 mb-2">💳</div>
      <h5>תשלום מאובטח</h5>
      <p className="text-muted">תשלום מאובטח </p>
    </Col>
    <Col md={4} className="text-center mb-3">
      <div className="display-4 mb-2">🔄</div>
      <h5>החזרה חינם</h5>
      <p className="text-muted">החזרה חינם בתוך 14 יום</p>
    </Col>
  </Row>
);

export default HomeInfoSection;