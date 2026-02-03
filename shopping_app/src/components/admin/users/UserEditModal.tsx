import React from 'react';
import { Modal, Form, Button, Image } from 'react-bootstrap';
import { type User, type UserFormData } from '../../../types/user';

interface Props {
  show: boolean;
  onHide: () => void;
  editingUser: User | null;
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  onSubmit: () => void;
}

const UserEditModal: React.FC<Props> = ({
  show, onHide, editingUser, formData, setFormData, onSubmit,
}) => (
  <Modal show={show} onHide={onHide} dir="rtl" centered size="lg">
    <Modal.Header closeButton>
      <Modal.Title>עריכת משתמש</Modal.Title>
    </Modal.Header>
    <Modal.Body className="text-end">
      {editingUser?.picture && (
        <div className="text-center mb-3">
          <Image
            src={editingUser.picture}
            roundedCircle
            width={80}
            height={80}
            className="object-fit-cover shadow-sm"
          />
        </div>
      )}

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>שם משתמש</Form.Label>
          <Form.Control
            type="text"
            value={formData.user_name}
            onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>אימייל</Form.Label>
          <Form.Control
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>שם פרטי</Form.Label>
          <Form.Control
            type="text"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>שם משפחה</Form.Label>
          <Form.Control
            type="text"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>תפקיד</Form.Label>
          <Form.Select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
          >
            <option value="user">משתמש רגיל</option>
            <option value="admin">מנהל</option>
          </Form.Select>
        </Form.Group>

        {editingUser && (
          <div className="bg-light rounded p-3 mt-3">
            <small className="text-muted d-block mb-1">
              ספק: {editingUser.provider === 'google' ? 'Google' : 'רגיל'}
            </small>
            <small className="text-muted d-block">
              תאריך הצטרפות: {editingUser.created_at ? new Date(editingUser.created_at).toLocaleDateString('he-IL') : '-'}
            </small>
          </div>
        )}
      </Form>
    </Modal.Body>
    <Modal.Footer className="justify-content-start">
      <Button variant="secondary" onClick={onHide}>ביטול</Button>
      <Button variant="primary" onClick={onSubmit} disabled={!formData.email}>
        שמור שינויים
      </Button>
    </Modal.Footer>
  </Modal>
);

export default UserEditModal;
