import React from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { FaShippingFast, FaCreditCard, FaLock } from 'react-icons/fa';

interface Props {
  shippingDetails: any;
  validated: boolean;
  loading: boolean;
  total: number;
  handleChange: (e: any) => void;
  handleSubmit: (e: any) => void;
}

const ShippingForm: React.FC<Props> = ({ 
  shippingDetails, validated, loading, total, handleChange, handleSubmit 
}) => (
  <Card className="shadow-sm border-0">
    <Card.Header className="bg-white py-3 border-bottom">
      <FaShippingFast className="text-primary me-2" /> <b>פרטי משלוח</b>
    </Card.Header>
    <Card.Body className="p-4">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>שם מלא *</Form.Label>
          <Form.Control name="fullName" value={shippingDetails.fullName} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>כתובת *</Form.Label>
          <Form.Control name="address" value={shippingDetails.address} onChange={handleChange} required />
        </Form.Group>

        <Row>
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label>עיר *</Form.Label>
              <Form.Control name="city" value={shippingDetails.city} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>מיקוד</Form.Label>
              <Form.Control name="postalCode" value={shippingDetails.postalCode} onChange={handleChange} pattern="[0-9]{7}" />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>טלפון *</Form.Label>
          <Form.Control name="phone" type="tel" value={shippingDetails.phone} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>הערות</Form.Label>
          <Form.Control as="textarea" name="notes" value={shippingDetails.notes} onChange={handleChange} rows={2} />
        </Form.Group>

        <div className="bg-light rounded p-3 mb-4">
          <h6 className="fw-bold"><FaCreditCard className="me-2" /> אמצעי תשלום</h6>
          <Form.Check type="radio" label="תשלום במזומן בעת המסירה" defaultChecked />
        </div>

        <Button variant="primary" type="submit" size="lg" className="w-100 py-3 fw-bold" disabled={loading}>
          {loading ? 'מעבד הזמנה...' : (
            <><FaLock className="me-2" /> אישור וביצוע הזמנה - ₪{total.toFixed(2)}</>
          )}
        </Button>
      </Form>
    </Card.Body>
  </Card>
);

export default ShippingForm;