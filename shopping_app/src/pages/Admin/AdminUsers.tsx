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
    showDeleted, setShowDeleted,
    handleOpenModal, handleSubmit, handleDelete, handleRestore, loadUsers,
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

      <div className="d-flex flex-column flex-md-row justify-content-end align-items-md-center gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <Form.Check
            type="switch"
            id="show-deleted-switch"
            label="הצג משתמשים מחוקים"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
          />
          <Button variant="outline-primary" size="sm" onClick={() => loadUsers(showDeleted)}>
            <FaRedo className="me-1" /> רענן
          </Button>
        </div>
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
          <UserTable users={users} onEdit={handleOpenModal} onDelete={handleDelete} onRestore={showDeleted ? handleRestore : undefined} />
          <UserMobileList users={users} onEdit={handleOpenModal} onDelete={handleDelete} onRestore={showDeleted ? handleRestore : undefined} />
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
