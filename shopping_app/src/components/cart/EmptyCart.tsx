import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmptyCart: React.FC = () => (
  <Container className="text-center mt-5 py-5 border rounded shadow-sm bg-light">
    <h2 className="display-6">סל הקניות שלך ריק 🛒</h2>
    <p className="text-muted">נראה שעדיין לא הוספת מוצרים לסל. זה הזמן להתחיל לקנות!</p>
    <Link to="/" className="btn btn-primary btn-lg mt-3 px-4 shadow">חזור לחנות</Link>
  </Container>
);

export default EmptyCart;