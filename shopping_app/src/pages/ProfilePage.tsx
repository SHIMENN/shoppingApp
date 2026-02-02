import React, { useState } from 'react';
import { Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import { useProfile } from '../hooks/useProfile';
import ProfileField from '../components/profile/ProfileField';

const Profile: React.FC = () => {
  const {
    user, isAuthenticated, isEditing, isSaving, formData,
    setFormData, setIsEditing, handleSave, handleCancel, navigate
  } = useProfile();

  const [imageError, setImageError] = useState(false);

  if (!isAuthenticated) return null;

  const isGoogleUser = user?.provider === 'google';

  return (
    <>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-danger text-white text-center py-4">
              <h3 className="mb-0">הפרופיל שלי</h3>
            </Card.Header>
            <Card.Body className="p-4">

              {/* Profile Header Image Section */}
              <div className="text-center mb-4">
                {user?.picture && !imageError ? (
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="rounded-circle border border-3 border-danger"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center border border-3 border-danger" style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>👤</div>
                )}
                <h4 className="mt-3">{user?.user_name || 'משתמש יקר'}</h4>
                {isGoogleUser && <span className="badge bg-info">מחובר עם Google</span>}
              </div>

              <Form>
                <ProfileField label="שם משתמש" value={formData.user_name} isEditing={isEditing} onChange={(val) => setFormData({...formData, user_name: val})} />
                <ProfileField label="שם פרטי" value={formData.first_name} isEditing={isEditing} onChange={(val) => setFormData({...formData, first_name: val})} />
                <ProfileField label="שם משפחה" value={formData.last_name} isEditing={isEditing} onChange={(val) => setFormData({...formData, last_name: val})} />
                <ProfileField 
                  label="אימייל" 
                  value={formData.email} 
                  isEditing={isEditing} 
                  readOnly={isGoogleUser}
                  onChange={(val) => setFormData({...formData, email: val})}
                  text={isGoogleUser ? "לא ניתן לשנות אימייל של חשבון Google" : ""}
                />
                
                <hr />
                <ProfileField label="תפקיד" value={user?.role === 'admin' ? 'מנהל' : 'משתמש'} isEditing={false} />
                <ProfileField label="תאריך הצטרפות" value={user?.created_at ? new Date(user.created_at).toLocaleDateString('he-IL') : '-'} isEditing={false} />
              </Form>

              <div className="d-grid gap-2 mt-4">
                {isEditing ? (
                  <>
                    <Button variant="success" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? <Spinner size="sm" /> : 'שמור שינויים'}
                    </Button>
                    <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>ביטול</Button>
                  </>
                ) : (
                  <Button variant="outline-primary" onClick={() => setIsEditing(true)}>ערוך פרטים</Button>
                )}
                <Button variant="outline-danger" onClick={() => navigate('/my-orders')}>ההזמנות שלי</Button>
                <Button variant="light" onClick={() => navigate('/')}>דף הבית</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Profile;