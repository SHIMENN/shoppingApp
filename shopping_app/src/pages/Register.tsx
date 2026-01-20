import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../services/authService';
// ייבוא הסטור של Zustand
import { useAuthStore } from '../store/useAuthStore'; 

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();
  
  // שליפת הפונקציה לעדכון נתוני האימות מהסטור
  const setAuthData = useAuthStore((state) => state.setAuthData);

  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();
    try {
      // קריאה לשרת (NestJS) ליצירת משתמש חדש
      const response = await registerApi(formData.username, formData.email, formData.password);
      
      // עדכון הסטור בנתונים שהתקבלו (ה-persist דואג לשמור ב-LocalStorage אוטומטית)
      setAuthData(response.userData, response.token);
      
      alert('נרשמת והתחברת בהצלחה!');
      navigate('/');
    } catch (err) {
      alert('שגיאה בהרשמה. וודא שהפרטים תקינים או שהמשתמש לא קיים כבר.');
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: '450px' }} className="shadow p-4">
        <h2 className="text-center mb-4">הרשמה למערכת</h2>
        <Form onSubmit={handleSubmit} className="text-end">
          <Form.Group className="mb-3">
            <Form.Label>שם משתמש</Form.Label>
            <Form.Control 
              type="text" 
              required 
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>אימייל</Form.Label>
            <Form.Control 
              type="email" 
              required 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>סיסמה</Form.Label>
            <Form.Control 
              type="password" 
              required 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </Form.Group>
          <Button variant="success" type="submit" className="w-100">צור חשבון</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;