// ניהול דף הבית להצגת מוצרים
import React, { useEffect, useState } from 'react';
import { Container, Col, Spinner, Alert } from 'react-bootstrap';
import { type Product } from '../../types/index';
import { fetchProducts } from '../../services/productService';
import ProductCard from '../../components/ProductCard';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('שגיאה בטעינת המוצרים. נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;

  return (
    <Container>
      <h2 className="mb-4 text-end">המוצרים שלנו</h2>
        {products.map((product) => (
          <Col key={product.id}>
            <ProductCard 
              product={product} 
              onAddToCart={(p) => console.log('נוסף לעגלה:', p.name)} 
            />
          </Col>
        ))}
    </Container>
  );
};

export default Home;