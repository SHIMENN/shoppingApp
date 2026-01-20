import React from 'react';
import { Container, Table } from 'react-bootstrap';
import { useCartStore } from '../store/useCartStore';
import EmptyCart from '../components/cart/EmptyCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const CartPage: React.FC = () => {
  const { cart, clearCart, getTotalPrice } = useCartStore();

  if (cart.length === 0) return <EmptyCart />;

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-end fw-bold">עגלת הקניות שלי</h2>
      
      <Table responsive hover className="text-end align-middle shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>מוצר</th>
            <th>מחיר</th>
            <th className="text-center">כמות</th>
            <th>סה"כ</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </tbody>
      </Table>
      
      <CartSummary 
        totalPrice={getTotalPrice()} 
        onClear={clearCart} 
      />
    </Container>
  );
};

export default CartPage;