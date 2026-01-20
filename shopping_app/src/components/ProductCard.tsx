// סרגל רכיב כרטיס מוצר המציג מידע בסיסי על המוצר
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { type Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <Card className="h-100 shadow-sm">
      {/* תמונה המגיעה מפתרון אחסון חיצוני כמו Cloudinary */}
      <Card.Img 
        variant="top" 
        src={product.imageUrl || 'https://via.placeholder.com/150'} 
        style={{ height: '200px', objectFit: 'cover' }} 
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text className="text-muted flex-grow-1">
          {product.description.substring(0, 60)}...
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fw-bold fs-5">₪{product.price}</span>
          {product.stock > 0 ? (
            <Button variant="primary" onClick={() => onAddToCart(product)}>
              הוסף לעגלה
            </Button>
          ) : (
            <Badge bg="secondary">אזל מהמלאי</Badge>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;