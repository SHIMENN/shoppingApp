import React from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import { useCheckout } from '../hooks/useCheckout';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import ShippingForm from '../components/cart/ShippingForm';
import EmptyCart from '../components/cart/EmptyCart';

const CheckoutPage: React.FC = () => {
  const {
    cart, loading, error, setError, validated, shippingDetails,
    subtotal, shippingCost, total,
    handleChange, handleSubmit, navigate,
    isBuyNowMode, cancelBuyNow
  } = useCheckout();

  // טיפול בעגלה ריקה
  if (cart.length === 0) return < EmptyCart />;

  return (
    <>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" className="p-0 me-3 text-dark" onClick={() => {
          if (isBuyNowMode) {
            cancelBuyNow();
          }
          navigate('/cart');
        }}>
          <FaArrowRight size={20} />
        </Button>
        <h2 className="mb-0 fw-bold">השלמת הזמנה</h2>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Row>
        <Col lg={7} className="mb-4">
          <ShippingForm
            shippingDetails={shippingDetails}
            validated={validated}
            loading={loading}
            total={total}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </Col>

        <Col lg={5}>
          <CheckoutSummary
            cart={cart}
            subtotal={subtotal}
            shippingCost={shippingCost}
            total={total}
          />
        </Col>
      </Row>
    </>
  );
};

export default CheckoutPage;