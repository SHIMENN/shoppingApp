import React from 'react';
import { Modal, Form, Button, Image } from 'react-bootstrap';
import {type ProductFormData } from '../../types/admin';

interface Props {
  show: boolean;
  onHide: () => void;
  editingProduct: any;
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const ProductModal: React.FC<Props> = ({ 
  show, onHide, editingProduct, formData, setFormData, handleImageChange, onSubmit 
}) => (
  <Modal show={show} onHide={onHide} dir="rtl" centered size="lg">
    <Modal.Header closeButton>
      <Modal.Title>{editingProduct ? 'עריכת מוצר' : 'הוספת מוצר חדש'}</Modal.Title>
    </Modal.Header>
    <Modal.Body className="text-end">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>שם המוצר *</Form.Label>
          <Form.Control type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>תיאור המוצר *</Form.Label>
          <Form.Control as="textarea" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>מחיר (₪) *</Form.Label>
          <Form.Control type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>כמות במלאי *</Form.Label>
          <Form.Control type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>העלאת תמונה</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          {formData.image_url && (
            <div className="mt-3 text-center">
              <Image src={formData.image_url} rounded style={{ maxWidth: '200px' }} />
            </div>
          )}
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer className="justify-content-start">
      <Button variant="secondary" onClick={onHide}>ביטול</Button>
      <Button variant="primary" onClick={onSubmit} disabled={!formData.name || !formData.price}>
        {editingProduct ? ' שמור שינויים' : 'הוסף מוצר'}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ProductModal;