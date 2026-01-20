import React, { useState } from 'react';
import { Container, Row, Col, Alert, Form, InputGroup, Badge } from 'react-bootstrap';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/useCartStore';
import { ProductCard, ProductSkeleton } from '../components/product';
import ToastNotification from '../components/common/ToastNotification';
import { useToast } from '../hooks/useToast';
import type { Product } from '../types/product';

const Home: React.FC = () => {
  const { products, loading, error } = useProducts();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toasts, showToast, removeToast } = useToast();

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product);
      showToast(`${product.name} נוסף לעגלה בהצלחה! 🛒`, 'success');
    } catch (error) {
      showToast('שגיאה בהוספת המוצר לעגלה', 'danger');
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');
  const [filterStock, setFilterStock] = useState<'all' | 'in-stock' | 'low-stock'>('all');

  // Filter and sort products
  const filteredProducts = Array.isArray(products)
    ? products
        .filter((product) => {
          // Search filter
          const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());

          // Stock filter
          const matchesStock =
            filterStock === 'all' ||
            (filterStock === 'in-stock' && product.stock > 0) ||
            (filterStock === 'low-stock' && product.stock > 0 && product.stock < 10);

          return matchesSearch && matchesStock;
        })
        .sort((a, b) => {
          if (sortBy === 'name') {
            return a.name.localeCompare(b.name, 'he');
          } else if (sortBy === 'price-asc') {
            return a.price - b.price;
          } else {
            return b.price - a.price;
          }
        })
    : [];

  if (loading) return <ProductSkeleton count={6} />;
  if (error) return <div className="alert alert-danger text-end">{error}</div>;

  return (
    <>
      <ToastNotification toasts={toasts} onClose={removeToast} />
      <Container className="py-4">
        {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-2">ברוכים הבאים לחנות שלנו 🛍️</h1>
        <p className="text-muted">גלה את המוצרים הטובים ביותר במחירים הכי משתלמים</p>
      </div>

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="חפש מוצר לפי שם או תיאור..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-end"
            />
            <InputGroup.Text>🔍</InputGroup.Text>
          </InputGroup>
        </Col>

        <Col md={3} className="mb-3">
          <Form.Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-end"
          >
            <option value="name">מיין לפי שם</option>
            <option value="price-asc">מחיר: מהנמוך לגבוה</option>
            <option value="price-desc">מחיר: מהגבוה לנמוך</option>
          </Form.Select>
        </Col>

        <Col md={3} className="mb-3">
          <Form.Select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value as any)}
            className="text-end"
          >
            <option value="all">כל המוצרים</option>
            <option value="in-stock">במלאי בלבד</option>
            <option value="low-stock">מלאי נמוך</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Results Count */}
      <div className="mb-3 text-end">
        <Badge bg="primary" className="fs-6">
          {filteredProducts.length} מוצרים נמצאו
        </Badge>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Alert variant="warning" className="text-center">
          <h5>לא נמצאו מוצרים התואמים לחיפוש שלך 🔍</h5>
          <p className="mb-0">נסה לשנות את מילות החיפוש או הסינונים</p>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product.product_id}>
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </Col>
          ))}
        </Row>
      )}

      {/* Info Section */}
      <Row className="mt-5 py-5 bg-light rounded">
        <Col md={4} className="text-center mb-3">
          <div className="display-4 mb-2">🚚</div>
          <h5>משלוח מהיר</h5>
          <p className="text-muted">משלוח עד הבית תוך 2-3 ימי עסקים</p>
        </Col>
        <Col md={4} className="text-center mb-3">
          <div className="display-4 mb-2">💳</div>
          <h5>תשלום מאובטח</h5>
          <p className="text-muted">תשלום מאובטח בכל אמצעי התשלום</p>
        </Col>
        <Col md={4} className="text-center mb-3">
          <div className="display-4 mb-2">🔄</div>
          <h5>החזרה חינם</h5>
          <p className="text-muted">החזרה חינם תוך 14 יום</p>
        </Col>
      </Row>
      </Container>
    </>
  );
};

export default Home;
