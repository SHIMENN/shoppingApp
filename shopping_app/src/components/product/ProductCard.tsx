//הצגת מוצר בף הבית
import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { type Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  // הפונקציה שתפעיל את המודל בדף הבית
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <Card 
      className="h-100 shadow-sm border-0 product-card-hover"
      onClick={() => onClick(product)}
      style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
    >
      <div className="position-relative overflow-hidden">
        <Card.Img
          variant="top"
          src={product.image_url || 'https://via.placeholder.com/300'}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        {product.stock <= 0 && (
          <Badge bg="secondary" className="position-absolute top-0 end-0 m-2 py-2 px-3">
            אזל מהמלאי
          </Badge>
        )}
      </div>

      <Card.Body className="d-flex flex-column text-end">
        <Card.Title className="fs-6 fw-bold mb-1 text-truncate">
          {product.name}
        </Card.Title>
        <Card.Text className="text-danger fw-bold fs-5 mb-0">
          ₪{product.price}
        </Card.Text>
        <small className="text-muted mt-2">לחץ לצפייה בפרטים</small>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;