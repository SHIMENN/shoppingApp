import React from 'react';
import { Button, Image } from 'react-bootstrap';
import { useCartStore } from '../../store/useCartStore';

interface CartItemProps {
  item: any; // מומלץ להשתמש ב-Type Product מהקובץ types/product.ts
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartStore();

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          {/* תיקון 1: שינוי מ-imageUrl ל-image_url כדי להתאים ל-Entity בשרת */}
          <Image 
            src={item.product.image_url || 'https://via.placeholder.com/50'} 
            rounded 
            style={{ width: '60px', height: '60px', objectFit: 'cover', marginLeft: '15px' }} 
          />
          <span className="fw-medium">{item.product.name}</span>
        </div>
      </td>
      <td className="text-secondary">₪{item.product.price}</td>
      <td className="text-center">
        <div className="d-flex justify-content-center align-items-center gap-3">
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
      </td>
      <td className="fw-bold">₪{item.product.price * item.quantity}</td>
      <td>
        <Button 
          variant="link" 
          className="text-danger p-0 text-decoration-none" 
    
          onClick={() => removeFromCart(item.product.product_id)}
        >
          הסר
        </Button>
      </td>
    </tr>
  );
};

export default CartItem;