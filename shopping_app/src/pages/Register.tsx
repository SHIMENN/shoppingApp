// pages/Register.tsx
import React from 'react';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import SocialButtons from '../components/auth/SocialButtons';

const Register: React.FC = () => {
  const { formData, showPassword, setShowPassword, handleSubmit, updateField, handleGoogleLogin } = useRegister();

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card style={{ width: '450px' }} className="shadow p-4">
        <h2 className="text-center mb-4 fw-bold">הרשמה</h2>

        <Form onSubmit={handleSubmit} className="text-end">
          <Form.Group className="mb-3">
            <Form.Label>שם משתמש</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="הכנס שם משתמש"
              onChange={(e) => updateField('username', e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>אימייל</Form.Label>
            <Form.Control
              type="email"
              required
              placeholder="הכנס אימייל"
              onChange={(e) => updateField('email', e.target.value)}
            />
          </Form.Group>

          {/* שדה סיסמה */}
          <Form.Group className="mb-3">
            <Form.Label>סיסמה</Form.Label>
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
                placeholder="הכנס סיסמה"
                minLength={8}
                onChange={(e) => updateField('password', e.target.value)}
                style={{ borderLeft: 'none' }}
              />
            </InputGroup>
          </Form.Group>

          {/* אימות סיסמה */}
          <Form.Group className="mb-3">
            <Form.Label>אימות סיסמה</Form.Label>
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
                placeholder="הקלד את הסיסמה שוב"
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                style={{ borderLeft: 'none' }}
              />
            </InputGroup>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <Form.Text className="text-danger">הסיסמאות לא תואמות</Form.Text>
            )}
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 mt-2">
            ✨ צור חשבון
          </Button>
        </Form>

        <div className="text-center my-3 text-muted">או</div>

        <SocialButtons onGoogleLogin={handleGoogleLogin} />

        <div className="text-center mt-4">
          כבר יש לך חשבון? <Link to="/login" className="text-decoration-none">התחבר כאן</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;