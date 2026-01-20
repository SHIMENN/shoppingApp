import React from 'react';
import { Button } from 'react-bootstrap';

interface CartSummaryProps {
  totalPrice: number;
  onClear: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ totalPrice, onClear }) => (
  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 p-4 border rounded bg-white shadow-sm">
    <Button variant="outline-danger" size="sm" onClick={onClear}>
      רוקן עגלת קניות
    </Button>
    
    <div className="text-center text-md-start">
      <h4 className="mb-2">סה"כ לתשלום: <span className="text-success fw-bold">₪{totalPrice}</span></h4>
      <Button variant="success" size="lg" className="px-5 shadow">
        המשך לתשלום
      </Button>
    </div>
  </div>
);

export default CartSummary;