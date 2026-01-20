import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/useCartStore';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton'; // אופציונלי: מחוון טעינה יפה


const Home: React.FC = () => {
  const { products, loading, error } = useProducts();
  console.log("Products in Home component:", products);
  const addToCart = useCartStore((state) => state.addToCart);

  if (loading) return <ProductSkeleton count={6} />; // שימוש ברכיב טעינה ייעודי
  if (error) return <div className="alert alert-danger text-end">{error}</div>;

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-end fw-bold">המוצרים שלנו</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {Array.isArray(products) ? (
          products.map((product) => (
            <Col key={product.id}>
            <ProductCard 
              product={product} 
              onAddToCart={addToCart} 
            />
          </Col>
          ))
          ) : (

            <Col xs={12}>
              <Alert variant='warning' className='text-end'>
              לא ניתן היה לטעון את רשימת המוצרים (פורמט נתונים שגוי).
              </Alert>
            </Col>
          )}
      </Row>
    </Container>
  );
};

export default Home;