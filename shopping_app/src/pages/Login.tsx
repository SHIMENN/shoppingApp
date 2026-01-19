// src/pages/Login.tsx
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../services/authService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, user } = await loginApi(email, password);
      login(token, user); // שמירה ב-Context וב-Storage [cite: 22, 24]
      navigate('/');
    } catch (err) {
      setError('פרטי התחברות שגויים. נסה שוב.');
    }
  };
  const handleGoogleLogin = () => {
  // הפניה ישירה ל-Endpoint בשרת ה-NestJS שמתחיל את תהליך ה-OAuth
  window.location.href = 'http://localhost:3000/auth/google';
};

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: '400px' }} className="shadow p-4">
        <h2 className="text-center mb-4">התחברות</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit} className="text-end">
          <Form.Group className="mb-3">
            <Form.Label>אימייל</Form.Label>
            <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>סיסמה</Form.Label>
            <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 mb-3">
            התחבר
          </Button>
          {/* כפתור גוגל - דרישה מהפרויקט [cite: 20] */}
          <Button variant="outline-danger" className="w-100" onClick={handleGoogleLogin}>
             התחבר עם Google
          </Button>
        </Form>
        <div className="text-center mt-3">
          אין לך חשבון? <Link to="/register">הרשם כאן</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Login;