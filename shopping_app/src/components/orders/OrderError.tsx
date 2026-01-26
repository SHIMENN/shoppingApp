import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { FaRedo } from 'react-icons/fa';

interface Props {
  message: string;
  onRetry: () => void;
}

const OrderError: React.FC<Props> = ({ message, onRetry }) => (
  <Container className="py-5">
    <Alert variant="danger" className="d-flex justify-content-between align-items-center">
      <span>{message}</span>
      <Button variant="outline-danger" size="sm" onClick={onRetry}>
        <FaRedo className="me-1" /> נסה שוב
      </Button>
    </Alert>
  </Container>
);

export default OrderError;