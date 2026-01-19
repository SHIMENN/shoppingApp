// src/pages/Admin/AdminProducts.tsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import {type Product } from '../../types';
import { fetchProducts } from '../../services/productService';
import api from '../../services/api';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, description: '', stock_quantity: 0 });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
      await api.delete(`/products/${id}`); // קריאת DELETE לשרת [cite: 43]
      loadProducts();
    }
  };

  const handleAddProduct = async () => {
    await api.post('/products', newProduct); // קריאת POST לשרת [cite: 42]
    setShowModal(false);
    loadProducts();
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="success" onClick={() => setShowModal(true)}>+ הוסף מוצר חדש</Button>
        <h2>ניהול מוצרים</h2>
      </div>

      <Table striped bordered hover responsive className="text-end">
        <thead>
          <tr>
            <th>מזהה</th>
            <th>שם המוצר</th>
            <th>מחיר</th>
            <th>מלאי</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.product_id}>
              <td>{p.product_id}</td>
              <td>{p.name}</td>
              <td>₪{p.price}</td>
              <td>{p.stock_quantity}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(p.product_id)}>מחק</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* מודל להוספת מוצר */}
      <Modal show={showModal} onHide={() => setShowModal(false)} dir="rtl">
        <Modal.Header closeButton><Modal.Title>הוספת מוצר חדש</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>שם המוצר</Form.Label>
              <Form.Control type="text" onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>מחיר</Form.Label>
              <Form.Control type="number" onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
            </Form.Group>
            {/* כאן יש להוסיף שדה להעלאת תמונה ל-Cloudinary/S3 [cite: 12] */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>ביטול</Button>
          <Button variant="primary" onClick={handleAddProduct}>שמור מוצר</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminProducts;