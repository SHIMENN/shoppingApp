import React from 'react';
import { Card, ListGroup, Image, Alert } from 'react-bootstrap';
import { FaTruck } from 'react-icons/fa';
import {type CartItem } from '../../types/cart';

interface Props {
  cart: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

const CheckoutSummary: React.FC<Props> = ({ cart, subtotal, shippingCost, total }) => (
  <Card className="shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
    <Card.Header className="bg-white py-3 border-bottom">
      <h5 className="mb-0 fw-bold">סיכום הזמנה ({cart.length} פריטים)</h5>
    </Card.Header>
    <Card.Body className="p-0">
      <ListGroup variant="flush">
        {cart.map((item) => (
          <ListGroup.Item key={item.product.product_id} className="py-3">
            <div className="d-flex align-items-center">
              {item.product.image_url && (
                <Image src={item.product.image_url} width={60} height={60} className="rounded me-3 object-fit-cover" />
              )}
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">{item.product.name}</span>
                  <span className="text-muted">x{item.quantity}</span>
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <small className="text-muted">₪{Number(item.product.price).toFixed(2)}</small>
                  <span className="fw-bold">₪{(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card.Body>
    <Card.Footer className="bg-white p-3">
      <div className="d-flex justify-content-between mb-2">
        <span className="text-muted">סכום ביניים</span>
        <span>₪{subtotal.toFixed(2)}</span>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="text-muted"><FaTruck className="me-1" /> משלוח</span>
        <span className={shippingCost === 0 ? "text-success fw-bold" : ""}>
          {shippingCost === 0 ? "חינם!" : `₪${shippingCost.toFixed(2)}`}
        </span>
      </div>
      {shippingCost > 0 && (
        <Alert variant="info" className="py-2 px-3 mb-3 small">
          עוד ₪{(200 - subtotal).toFixed(2)} למשלוח חינם!
        </Alert>
      )}
      <hr />
      <div className="d-flex justify-content-between">
        <span className="fw-bold fs-5">סה"כ לתשלום</span>
        <span className="fw-bold fs-5 text-primary">₪{total.toFixed(2)}</span>
      </div>
    </Card.Footer>
  </Card>
);

export default CheckoutSummary;