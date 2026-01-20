import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import SocialButtons from '../components/auth/SocialButtons';

const LoginPage: React.FC = () => {
  const { setEmail, setPassword, error, loading, handleLogin, handleGoogleLogin } = useLogin();

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: '400px' }} className="shadow p-4">
        <h2 className="text-center mb-4 fw-bold">התחברות</h2>
        
        {error && <Alert variant="danger" className="text-end">{error}</Alert>}
        
        <Form onSubmit={handleLogin} className="text-end">
          <Form.Group className="mb-3">
            <Form.Label>אימייל</Form.Label>
            <Form.Control 
              type="email" 
              required 
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>סיסמה</Form.Label>
            <Form.Control 
              type="password" 
              required 
              placeholder="הכנס סיסמה"
              onChange={(e) => setPassword(e.target.value)} 
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? 'מתחבר...' : 'התחבר'}
          </Button>
        </Form>

        <div className="text-center my-3 text-muted">או</div>

        <SocialButtons onGoogleLogin={handleGoogleLogin} />
        
        <div className="text-center mt-4">
          אין לך חשבון? <Link to="/register" className="text-decoration-none">הרשם כאן</Link>
        </div>
      </Card>
    </Container>
  );
};

export default LoginPage;