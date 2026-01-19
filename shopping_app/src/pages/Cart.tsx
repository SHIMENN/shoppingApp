// src/pages/Cart.tsx
import React from 'react';
import { Container, Table, Button, Image,  } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <Container className="text-center mt-5">
        <h2>סל הקניות שלך ריק 🛒</h2>
        <p>נראה שעדיין לא הוספת מוצרים לסל.</p>
        <Link to="/" className="btn btn-primary mt-3">חזור לחנות</Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-end">עגלת הקניות שלי</h2>
      <Table responsive hover className="text-end">
        <thead className="table-light">
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
            // חשוב: וודא שזה item.product.id (כפי שמוגדר ב-Provider)
            <tr key={item.product.id}> 
              <td>
                <Image 
                  src={item.product.imageUrl || 'https://via.placeholder.com/50'} 
                  rounded 
                  style={{ width: '50px', height: '50px', objectFit: 'cover', marginLeft: '10px' }} 
                />
                {item.product.name}
              </td>
              <td>₪{item.product.price}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >-</Button>
                  <span style={{ minWidth: '30px' }}>{item.quantity}</span>
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >+</Button>
                </div>
              </td>
              <td>₪{item.product.price * item.quantity}</td>
              <td>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => removeFromCart(item.product.id)}
                >
                  מחק
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <div className="d-flex justify-content-between align-items-center mt-4 p-4 border rounded bg-light shadow-sm">
        <div>
          <Button variant="outline-dark" size="sm" onClick={clearCart} className="me-2">רוקן עגלה</Button>
        </div>
        <div className="text-start">
          <h4 className="mb-0">סה"כ לתשלום: <span className="text-primary">₪{totalPrice}</span></h4>
          <Button variant="success" size="lg" className="mt-3 w-100">המשך לתשלום</Button>
        </div>
      </div>
    </Container>
  );
};

export default Cart;