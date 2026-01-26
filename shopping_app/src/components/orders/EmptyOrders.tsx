import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';

const EmptyOrders: React.FC = () => (
  <Card className="border-0 shadow-sm text-center py-5">
    <Card.Body>
      <FaShoppingBag size={48} className="text-muted mb-3" />
      <h5 className="fw-bold">עדיין לא ביצעת הזמנות</h5>
      <p className="text-muted mb-4">ההזמנות שלך יופיעו כאן לאחר רכישה</p>
      <Link to="/" className="btn btn-primary">
        לחנות
      </Link>
    </Card.Body>
  </Card>
);

export default EmptyOrders;