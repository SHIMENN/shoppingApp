import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { type CartSummaryProps } from '../../types/cart';

const CartSummary: React.FC<CartSummaryProps> = ({
  totalPrice,
  onClear,
  onCheckout,
  isLoading,
}) => (
  <Card className="shadow-sm border-0 sticky-top" style={{ top: '100px' }}>
    <Card.Body className="p-4">
      <h5 className="fw-bold mb-4 border-bottom pb-3">סיכום הזמנה</h5>

      <div className="d-flex justify-content-between mb-2">
        <span className="text-muted">סכום ביניים</span>
        <span>₪{totalPrice.toFixed(2)}</span>
      </div>

      <div className="d-flex justify-content-between mb-2">
        <span className="text-muted">משלוח</span>
        <span className="text-success">חינם</span>
      </div>

      <hr />

      <div className="d-flex justify-content-between mb-4">
        <span className="fw-bold fs-5">סה"כ לתשלום</span>
        <span className="fw-bold fs-5 text-success">₪{totalPrice.toFixed(2)}</span>
      </div>

      <Button
        variant="success"
        size="lg"
        className="w-100 mb-3 shadow-sm"
        onClick={onCheckout}
        disabled={isLoading}
      >
        {isLoading ? 'מעבד תשלום...' : 'המשך לתשלום 💳'}
      </Button>

      <Button
        variant="outline-danger"
        size="sm"
        className="w-100"
        onClick={onClear}
        disabled={isLoading}
      >
        רוקן עגלה
      </Button>
    </Card.Body>
  </Card>
);

export default CartSummary;
