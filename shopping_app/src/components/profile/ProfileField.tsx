import React from 'react';
import { Form } from 'react-bootstrap';

interface Props {
  label: string;
  value: string;
  isEditing: boolean;
  type?: string;
  readOnly?: boolean;
  onChange?: (val: string) => void;
  text?: string;
}

const ProfileField: React.FC<Props> = ({ label, value, isEditing, type = "text", readOnly, onChange, text }) => (
  <Form.Group className="mb-3">
    <Form.Label className="fw-bold">{label}</Form.Label>
    {isEditing && !readOnly ? (
      <Form.Control
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    ) : (
      <Form.Control plaintext readOnly value={value || '-'} />
    )}
    {text && isEditing && <Form.Text className="text-muted">{text}</Form.Text>}
  </Form.Group>
);

export default ProfileField;
