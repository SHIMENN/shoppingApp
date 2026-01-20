// src/pages/Admin/AdminProducts.tsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { useProductStore } from '../../store/useProductStore';

const AdminProducts: React.FC = () => {
  // שימוש ב-Zustand במקום ב-useState מקומי למערך המוצרים
  const { products, loading, loadProducts, addProduct, deleteProduct } = useProductStore();
  
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, stock_quantity: 0 });

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddProduct = async () => {
    await addProduct(newProduct);
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
      await deleteProduct(id);
    }
  };

  if (loading && products.length === 0) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 text-end">
        <Button variant="success" onClick={() => setShowModal(true)}>+ הוסף מוצר חדש</Button>
        <h2 className="fw-bold">ניהול קטלוג מוצרים</h2>
      </div>

      <Table striped bordered hover responsive className="text-end shadow-sm">
        <thead className="table-dark">
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
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>₪{p.price}</td>
              <td>{p.stock
                
                }</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>מחק</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} dir="rtl" centered>
        <Modal.Header closeButton className="text-end"><Modal.Title w-100>הוספת מוצר חדש</Modal.Title></Modal.Header>
        <Modal.Body className="text-end">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>שם המוצר</Form.Label>
              <Form.Control type="text" onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>מחיר</Form.Label>
              <Form.Control type="number" onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>כמות במלאי</Form.Label>
              <Form.Control type="number" onChange={e => setNewProduct({...newProduct, stock_quantity: Number(e.target.value)})} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-start">
          <Button variant="secondary" onClick={() => setShowModal(false)}>ביטול</Button>
          <Button variant="primary" onClick={handleAddProduct}>שמור מוצר</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminProducts;