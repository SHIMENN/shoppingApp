import React, { useEffect } from 'react';
import { Container, Table, Alert, Spinner, Badge, Button, Card, Row, Col } from 'react-bootstrap';
import { useCartStore } from '../store/useCartStore';
import { EmptyCart, CartItem, CartSummary } from '../components/cart/index';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import ToastNotification from '../components/common/ToastNotification';

const CartPage: React.FC = () => {
  const { cart, loading, error, fetchCart, clearCart, getTotalItems, checkout } = useCartStore();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /**
   * חישוב סה"כ מחיר בצורה בטוחה:
   * המרה מפורשת ל-Number כדי להתמודד עם ערכי Decimal (String) שמגיעים מה-DB.
   */
  const safeTotalPrice = cart.reduce((acc, item) => {
    const itemPrice = Number(item.product.price) || 0;
    return acc + (itemPrice * item.quantity);
  }, 0);

  const handleCheckout = async () => {
    try {
      await checkout();
      showToast('ההזמנה בוצעה בהצלחה! תודה שקנית אצלנו 🎉', 'success');
      setTimeout(() => {
        navigate('/my-orders');
      }, 1500);
    } catch (error) {
      showToast('שגיאה בביצוע ההזמנה. אנא נסה שוב', 'danger');
    }
  };

  if (loading && cart.length === 0) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">טוען עגלה...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="text-end">
          <h5>שגיאה בטעינת העגלה</h5>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => fetchCart()}>
            נסה שוב
          </Button>
        </Alert>
      </Container>
    );
  }

  if (cart.length === 0) return <EmptyCart />;

  return (
    <>
      <ToastNotification toasts={toasts} onClose={removeToast} />
      <Container className="mt-4 text-end" dir="rtl">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/" className="btn btn-outline-primary">
            ← המשך בקנייה
          </Link>
          <div>
            <h2 className="fw-bold mb-1">עגלת הקניות שלי 🛒</h2>
            <Badge bg="secondary">{getTotalItems()} פריטים</Badge>
          </div>
        </div>

        <Row>
          {/* רשימת המוצרים */}
          <Col lg={8}>
            <Card className="shadow-sm mb-4 border-0">
              <Card.Body className="p-0">
                <Table responsive hover className="text-end align-middle mb-0">
                  <thead className="table-light border-bottom">
                    <tr>
                      <th className="py-3 px-3">מוצר</th>
                      <th className="py-3">מחיר</th>
                      <th className="text-center py-3">כמות</th>
                      <th className="py-3">סה"כ</th>
                      <th className="py-3 text-center">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <CartItem key={item.product.product_id} item={item} />
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            
            <div className="d-flex justify-content-start mb-4">
              <Button 
                variant="link" 
                className="text-danger text-decoration-none p-0" 
                onClick={() => {
                  if(window.confirm('האם אתה בטוח שברצונך לרוקן את כל העגלה?')) clearCart();
                }}
              >
                🗑️ רוקן עגלה לגמרי
              </Button>
            </div>
          </Col>

          {/* סיכום הזמנה */}
          <Col lg={4}>
            <CartSummary 
              totalPrice={safeTotalPrice} 
              onClear={clearCart} 
              onCheckout={handleCheckout} 
              isLoading={loading} 
            />
          </Col>
        </Row>

        {/* Trust Badges - יתרונות החנות */}
        <div className="mt-4 p-4 bg-light rounded text-center shadow-sm">
          <Row>
            <Col md={4} className="mb-3 mb-md-0 border-start-md">
              <div className="fs-3 mb-2">🔒</div>
              <div className="fw-bold">תשלום מאובטח</div>
              <small className="text-muted">עמידה בתקני אבטחה מחמירים PCI-DSS</small>
            </Col>
            <Col md={4} className="mb-3 mb-md-0 border-start-md">
              <div className="fs-3 mb-2">🚚</div>
              <div className="fw-bold">משלוח מהיר</div>
              <small className="text-muted">עד 3 ימי עסקים לכל חלקי הארץ</small>
            </Col>
            <Col md={4}>
              <div className="fs-3 mb-2">↩️</div>
              <div className="fw-bold">החזרה קלה</div>
              <small className="text-muted">ניתן להחזיר מוצר תוך 14 יום באריזה מקורית</small>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default CartPage;