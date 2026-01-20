import React, { useState } from 'react';
import { Container, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const setAuthData = useAuthStore((state) => state.setAuthData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerApi(formData.username, formData.email, formData.password);
      setAuthData(response.userData, response.access_token);
      alert('נרשמת והתחברת בהצלחה!');
      navigate('/');
    } catch (err) {
      alert('שגיאה בהרשמה. וודא שהפרטים תקינים או שהמשתמש לא קיים כבר.');
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: '450px' }} className="shadow p-4">
        <h2 className="text-center mb-4 fw-bold">הרשמה למערכת</h2>

        <Form onSubmit={handleSubmit} className="text-end">
          <Form.Group className="mb-3">
            <Form.Label>שם משתמש *</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="הכנס שם משתמש"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>אימייל *</Form.Label>
            <Form.Control
              type="email"
              required
              placeholder="name@example.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>סיסמה *</Form.Label>
            <InputGroup>
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{ borderRight: 'none' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </Button>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="הכנס סיסמה (לפחות 6 תווים)"
                minLength={6}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ borderLeft: 'none' }}
              />
            </InputGroup>
            <Form.Text className="text-muted text-end d-block">
              הסיסמה חייבת להכיל לפחות 6 תווים
            </Form.Text>
          </Form.Group>

          <Button variant="success" type="submit" className="w-100">
            ✨ צור חשבון
          </Button>
        </Form>

        <div className="text-center mt-4">
          כבר יש לך חשבון? <Link to="/login" className="text-decoration-none">התחבר כאן</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Register;
