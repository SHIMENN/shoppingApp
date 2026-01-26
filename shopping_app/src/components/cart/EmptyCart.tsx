import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmptyCart: React.FC = () => (
  <Container className="text-center mt-5 py-5 border rounded shadow-sm bg-light">
    <h2 className="display-6">סל הקניות ריק </h2>
    <p className=" text-muted mt-3">עדיין לא הוספת מוצרים לסל!</p>
    <Link to="/" className="btn btn-outline-danger btn-lg mt-3 px-4 shadow">חזור לדף הבית</Link>
  </Container>
);

export default EmptyCart;