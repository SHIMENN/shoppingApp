import React, { useEffect, useState } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmailApi } from '../services/authService';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('טוקן לא תקין');
        setLoading(false);
        return;
      }

      try {
        await verifyEmailApi(token);
        setSuccess(true);
        // מעביר לדף התחברות אחרי 3 שניות
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'אירעה שגיאה באימות האימייל. ייתכן שהטוקן פג תוקף.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow-sm">
            <Card.Body className="p-5 text-center">
              {loading && (
                <>
                  <Spinner animation="border" variant="primary" className="mb-3" />
                  <h3 className="fw-bold mb-2">מאמת אימייל...</h3>
                  <p className="text-muted">אנא המתן בזמן שאנו מאמתים את כתובת האימייל שלך</p>
                </>
              )}

              {success && !loading && (
                <>
                  <div className="mb-4">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h3 className="fw-bold text-success mb-3">האימייל אומת בהצלחה!</h3>
                  <Alert variant="success" className="text-end">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    החשבון שלך אומת בהצלחה. מעביר לדף התחברות...
                  </Alert>
                  <Link to="/login" className="btn btn-primary mt-3">
                    המשך להתחברות
                  </Link>
                </>
              )}

              {error && !loading && (
                <>
                  <div className="mb-4">
                    <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h3 className="fw-bold text-danger mb-3">אימות נכשל</h3>
                  <Alert variant="danger" className="text-end">
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    {error}
                  </Alert>
                  <div className="mt-4">
                    <Link to="/login" className="btn btn-primary me-2">
                      חזור להתחברות
                    </Link>
                    <Link to="/register" className="btn btn-outline-secondary">
                      הרשמה מחדש
                    </Link>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default VerifyEmail;
