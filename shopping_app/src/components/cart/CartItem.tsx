import React from 'react';
import { Button, Image } from 'react-bootstrap';
import { useCartStore } from '../../store/useCartStore';
import { type CartItemProps } from '../../types/cart';

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartStore();
  const itemTotal = Number(item.product.price) * item.quantity;

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <Image
            src={item.product.image_url || 'https://via.placeholder.com/50'}
            rounded
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              marginLeft: '15px',
            }}
          />
          <span className="fw-medium">{item.product.name}</span>
        </div>
      </td>
      <td className="text-secondary">₪{Number(item.product.price).toFixed(2)}</td>
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
      <td className="fw-bold">₪{itemTotal.toFixed(2)}</td>
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
