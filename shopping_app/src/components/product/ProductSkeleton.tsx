//כרטיסי מוצרים ריקים מופיעים   בטעינה
import React from 'react';
import { Card, Col, Row, Container, Placeholder } from 'react-bootstrap';

interface ProductSkeletonProps {
  count?: number; // כמה כרטיסים להציג בזמן הטעינה
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 6 }) => {
  // יוצרים מערך באורך ה-count כדי לרנדר מספר כרטיסים
  const skeletons = Array.from({ length: count });

  return (
    <Container className="py-4">
      <Placeholder as="h2" animation="glow">
        <Placeholder xs={3} className="mb-4" />
      </Placeholder>
      
      <Row xs={1} md={2} lg={3} className="g-4">
        {skeletons.map((_, idx) => (
          <Col key={idx}>
            <Card className="shadow-sm border-0">
              {/* מקום לתמונה */}
              <div className="ratio ratio-16x9 bg-light" />
              
              <Card.Body className="text-end">
                <Placeholder as={Card.Title} animation="glow">
                  <Placeholder xs={8} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="glow">
                  <Placeholder xs={4} /> <Placeholder xs={4} />
                </Placeholder>
                <Placeholder.Button variant="primary" xs={12} />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductSkeleton;