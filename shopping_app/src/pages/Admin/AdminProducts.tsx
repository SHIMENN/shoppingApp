import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Badge, Image } from 'react-bootstrap';
import { useProductStore } from '../../store/useProductStore';
import ToastNotification from '../../components/common/ToastNotification';
import { useToast } from '../../hooks/useToast';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  image_url?: string;
}

const AdminProducts: React.FC = () => {
  const { products, loading, loadProducts, deleteProduct } = useProductStore();
  const { toasts, showToast, removeToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        image_url: product.image_url,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        image_url: '',
      });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);

      // הוספת תמונה אם נבחרה תמונה חדשה
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingProduct) {
        // עדכון מוצר קיים
        const response = await fetch(`http://localhost:3000/products/${editingProduct.product_id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error('Failed to update product');
        }
      } else {
        // הוספת מוצר חדש
        if (!imageFile) {
          showToast('נא להעלות תמונה למוצר', 'warning');
          return;
        }

        const response = await fetch('http://localhost:3000/products', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error('Failed to create product');
        }
      }

      setShowModal(false);
      await loadProducts();
      showToast(
        editingProduct ? 'המוצר עודכן בהצלחה! ✅' : 'המוצר נוסף בהצלחה! ✅',
        'success'
      );
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('שגיאה בשמירת המוצר', 'danger');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
      try {
        await deleteProduct(id);
        showToast('המוצר נמחק בהצלחה! 🗑️', 'success');
      } catch (error) {
        showToast('שגיאה במחיקת המוצר', 'danger');
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      // Preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image_url: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (loading && products.length === 0) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  return (
    <>
      <ToastNotification toasts={toasts} onClose={removeToast} />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="success" onClick={() => handleOpenModal()}>
            + הוסף מוצר חדש
          </Button>
          <h2 className="fw-bold mb-0">ניהול קטלוג מוצרים</h2>
        </div>

        <Table striped bordered hover responsive className="text-end shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>תמונה</th>
              <th>מזהה</th>
              <th>שם המוצר</th>
              <th>תיאור</th>
              <th>מחיר</th>
              <th>מלאי</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.product_id}>
                <td>
                  <Image
                    src={p.image_url || 'https://via.placeholder.com/50'}
                    rounded
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td>{p.product_id}</td>
                <td className="fw-bold">{p.name}</td>
                <td>
                  <small className="text-muted">
                    {p.description?.substring(0, 50)}...
                  </small>
                </td>
                <td className="text-success fw-bold">₪{p.price}</td>
                <td>
                  <Badge bg={p.stock > 10 ? 'success' : p.stock > 0 ? 'warning' : 'danger'}>
                    {p.stock} יחידות
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenModal(p)}
                    >
                      ✏️ ערוך
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(p.product_id)}
                    >
                      🗑️ מחק
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal for Add/Edit Product */}
        <Modal show={showModal} onHide={() => setShowModal(false)} dir="rtl" centered size="lg">
          <Modal.Header closeButton className="text-end">
            <Modal.Title>
              {editingProduct ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-end">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>שם המוצר *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="לדוגמה: טלפון סלולרי"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>תיאור המוצר *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="תאר את המוצר בפירוט..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>מחיר (₪) *</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  min="0"
                  step="0.01"
                  placeholder="הכנס מחיר"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>כמות במלאי *</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  min="0"
                  placeholder="הכנס כמות"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>העלאת תמונה {!editingProduct && '*'}</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Form.Text className="text-muted">
                  {editingProduct ? 'בחר תמונה חדשה רק אם ברצונך לעדכן אותה' : 'חובה להעלות תמונה למוצר חדש'}
                </Form.Text>
                {formData.image_url && (
                  <div className="mt-3 text-center">
                    <Image
                      src={formData.image_url}
                      rounded
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                  </div>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="justify-content-start">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              ביטול
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!formData.name || !formData.description || !formData.price || !formData.stock}
            >
              {editingProduct ? '💾 שמור שינויים' : '➕ הוסף מוצר'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default AdminProducts;
