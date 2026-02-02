import { useState } from 'react';
import {Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import SocialButtons from '../components/auth/SocialButtons';

const LoginPage: React.FC = () => {
  const { setEmail, setPassword, error, loading, handleLogin, handleGoogleLogin } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Card style={{ width: '400px' }} className="shadow p-4">
        <h2 className="text-center mb-4 fw-bold">התחברות</h2>

        {error && <Alert variant="danger" className="text-end">{error}</Alert>}

        <Form onSubmit={handleLogin} className="text-end">
          <Form.Group className="mb-3">
            <Form.Label>אימייל</Form.Label>
            <Form.Control
              type="email"
              required
              placeholder="הכנס אימייל"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

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
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderLeft: 'none' }}
              />
            </InputGroup>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? 'מתחבר...' : 'התחבר'}
          </Button>
        </Form>

        <div className="text-center my-3 text-muted">או</div>

        <SocialButtons onGoogleLogin={handleGoogleLogin} />

        <div className="text-center mt-4">
          אין לך חשבון? <Link to="/register" className="text-decoration-none">הרשמה</Link>
        </div>
      </Card>
    </>
  );
};

export default LoginPage;
