import React from 'react';
import { Row, Col, Table, Card, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyCart from '../components/cart/EmptyCart';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, updateQuantity, removeFromCart, loading, getTotalPrice } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <h2 className="mb-4 fw-bold">סל הקניות שלך</h2>
      <Row>
        <Col lg={8}>
          {/* Desktop - Table */}
          <Table responsive hover className="align-middle bg-white shadow-sm rounded d-none d-lg-table">
            <thead className="bg-light">
              <tr>
                <th>מוצר</th>
                <th>מחיר</th>
                <th className="text-center">כמות</th>
                <th>סה"כ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <CartItem key={item.product.product_id} item={item} />
              ))}
            </tbody>
          </Table>

          {/* Mobile - Cards */}
          <div className="d-lg-none d-flex flex-column gap-3 mb-3">
            {cart.map((item) => {
              const itemTotal = Number(item.product.price) * item.quantity;
              return (
                <Card key={item.product.product_id} className="border-0 shadow-sm">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <Image
                        src={item.product.image_url || 'https://via.placeholder.com/50'}
                        rounded
                        width={55}
                        height={55}
                        className="object-fit-cover"
                      />
                      <div className="flex-grow-1 text-end">
                        <div className="fw-bold">{item.product.name}</div>
                        <small className="text-muted">₪{Number(item.product.price).toFixed(2)}</small>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => updateQuantity(item.product.product_id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="fw-bold">{item.quantity}</span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => updateQuantity(item.product.product_id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <span className="fw-bold text-success">₪{itemTotal.toFixed(2)}</span>
                        <Button
                          variant="link"
                          className="text-danger p-0 text-decoration-none small"
                          onClick={() => removeFromCart(item.product.product_id)}
                        >
                          הסר
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </Col>

        <Col lg={4}>
          <CartSummary
            totalPrice={totalPrice}
            onClear={clearCart}
            onCheckout={handleCheckout}
            isLoading={loading}
          />
        </Col>
      </Row>
    </>
  );
};

export default CartPage;