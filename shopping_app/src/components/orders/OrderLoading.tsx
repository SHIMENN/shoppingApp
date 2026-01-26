import React from 'react';
import { Container, Spinner } from 'react-bootstrap';

const OrderLoading: React.FC = () => (
  <Container className="d-flex justify-content-center align-items-center min-vh-50 py-5">
    <div className="text-center">
      <Spinner animation="border" variant="primary" />
      <p className="mt-3 text-muted">טוען הזמנות...</p>
    </div>
  </Container>
);

export default OrderLoading;