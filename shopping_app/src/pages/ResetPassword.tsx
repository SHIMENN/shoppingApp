import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordApi } from '../services/authService';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('טוקן לא תקין. אנא בקש קישור חדש לאיפוס סיסמה.');
      return;
    }

    if (newPassword.length < 8) {
      setError('הסיסמה חייבת להכיל לפחות 8 תווים');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    setLoading(true);

    try {
      await resetPasswordApi(token, newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'אירעה שגיאה. ייתכן שהטוקן פג תוקף.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container className="py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <Alert variant="danger" className="text-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              טוקן לא תקין. אנא בקש קישור חדש לאיפוס סיסמה.
            </Alert>
            <div className="text-center">
              <Link to="/forgot-password" className="btn btn-primary">
                בקש קישור חדש
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">איפוס סיסמה</h2>
                <p className="text-muted">הזן סיסמה חדשה עבור החשבון שלך</p>
              </div>

              {success && (
                <Alert variant="success" className="text-end">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  הסיסמה אופסה בהצלחה! מעביר לדף התחברות...
                </Alert>
              )}

              {error && (
                <Alert variant="danger" className="text-end">
                  <i className="bi bi-exclamation-circle-fill me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">סיסמה חדשה</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="הזן סיסמה חדשה"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={loading || success}
                      dir="ltr"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading || success}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">לפחות 8 תווים</Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">אימות סיסמה</Form.Label>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="הזן שוב את הסיסמה"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading || success}
                    dir="ltr"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 fw-bold"
                  disabled={loading || success}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      מאפס סיסמה...
                    </>
                  ) : (
                    'אפס סיסמה'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  זכרת את הסיסמה?{' '}
                  <Link to="/login" className="text-decoration-none fw-bold">
                    התחבר כאן
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default ResetPassword;
