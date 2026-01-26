import React from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyCart from '../components/cart/EmptyCart';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, loading, getTotalPrice } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // מעבר לדף מילוי פרטי משלוח
    navigate('/checkout'); 
  };

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">סל הקניות שלך</h2>
      <Row>
        {/* צד ימין: רשימת המוצרים */}
        <Col lg={8}>
          <Table responsive hover className="align-middle bg-white shadow-sm rounded">
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
              {/* כאן קורה הקסם - אנחנו עוברים על כל המוצרים בעגלה ומציגים אותם */}
              {cart.map((item) => (
                <CartItem key={item.product.product_id} item={item} />
              ))}
            </tbody>
          </Table>
        </Col>

        {/* צד שמאל: סיכום הזמנה */}
        <Col lg={4}>
          <CartSummary
            totalPrice={totalPrice}
            onClear={clearCart}
            onCheckout={handleCheckout}
            isLoading={loading}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;