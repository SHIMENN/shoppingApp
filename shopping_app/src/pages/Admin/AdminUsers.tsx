import React from 'react';
import { Spinner, Alert, Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch, FaRedo } from 'react-icons/fa';
import { useAdminUsers } from '../../hooks/admin/useAdminUsers';
import ToastNotification from '../../components/common/ToastNotification';
import UserStats from '../../components/admin/users/UserStats';
import UserTable from '../../components/admin/users/UserTable';
import UserMobileList from '../../components/admin/users/UserMobileList';
import UserEditModal from '../../components/admin/users/UserEditModal';

const AdminUsers: React.FC = () => {
  const {
    users, loading, toasts, removeToast,
    showModal, setShowModal, editingUser, formData, setFormData,
    searchTerm, setSearchTerm,
    handleOpenModal, handleSubmit, handleDelete, loadUsers,
    totalUsers, adminCount, regularCount, googleCount,
  } = useAdminUsers();

  if (loading && users.length === 0) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">טוען משתמשים...</p>
      </div>
    );
  }

  return (
    <>
      <ToastNotification toasts={toasts} onClose={removeToast} />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">ניהול משתמשים</h2>
          <p className="text-muted mb-0">צפייה ועריכת פרטי משתמשים</p>
        </div>
        <Button variant="outline-primary" size="sm" onClick={loadUsers}>
          <FaRedo className="me-1" /> רענן
        </Button>
      </div>

      <UserStats
        totalUsers={totalUsers}
        adminCount={adminCount}
        regularCount={regularCount}
        googleCount={googleCount}
      />

      <InputGroup className="mb-4 shadow-sm">
        <InputGroup.Text className="bg-white border-end-0">
          <FaSearch className="text-muted" />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="חיפוש לפי שם, אימייל..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-start-0"
        />
      </InputGroup>

      {users.length === 0 ? (
        <Alert variant="info">לא נמצאו משתמשים</Alert>
      ) : (
        <>
          <UserTable users={users} onEdit={handleOpenModal} onDelete={handleDelete} />
          <UserMobileList users={users} onEdit={handleOpenModal} onDelete={handleDelete} />
        </>
      )}

      <UserEditModal
        show={showModal}
        onHide={() => setShowModal(false)}
        editingUser={editingUser}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AdminUsers;
