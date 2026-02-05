import React from 'react';
import { Table, Button, Badge, Image } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUndoAlt } from 'react-icons/fa';
import { type User } from '../../../types/user';

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  onRestore?: (userId: number) => void;
}

const UserTable: React.FC<Props> = ({ users, onEdit, onDelete, onRestore }) => (
  <Table striped bordered hover responsive className="text-end shadow-sm d-none d-md-table">
    <thead className="table-dark">
      <tr>
        <th>תמונה</th>
        <th>מזהה</th>
        <th>סטטוס</th>
        <th>שם משתמש</th>
        <th>אימייל</th>
        <th>שם מלא</th>
        <th>תפקיד</th>
        <th>ספק</th>
        <th>תאריך הצטרפות</th>
        <th>פעולות</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => {
        const isDeleted = !!user.deleted_at;
        return (
          <tr key={user.user_id} style={{ opacity: isDeleted ? 0.6 : 1, backgroundColor: isDeleted ? '#f8d7da' : 'inherit' }}>
            <td>
              <Image
                src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_name || user.email)}&background=random`}
                roundedCircle
                width={40}
                height={40}
                className="object-fit-cover"
              />
            </td>
            <td>{user.user_id}</td>
            <td>
              <Badge bg={isDeleted ? 'danger' : 'success'}>
                {isDeleted ? 'מחוק' : 'פעיל'}
              </Badge>
            </td>
            <td className="fw-bold">{user.user_name || '-'}</td>
            <td>{user.email}</td>
            <td>{[user.first_name, user.last_name].filter(Boolean).join(' ') || '-'}</td>
            <td>
              <Badge bg={user.role === 'admin' ? 'danger' : 'secondary'}>
                {user.role === 'admin' ? 'מנהל' : 'משתמש'}
              </Badge>
            </td>
            <td>
              <Badge bg={user.provider === 'google' ? 'info' : 'light'} text={user.provider === 'google' ? 'white' : 'dark'}>
                {user.provider === 'google' ? 'Google' : 'רגיל'}
              </Badge>
            </td>
            <td>{user.created_at ? new Date(user.created_at).toLocaleDateString('he-IL') : '-'}</td>
            <td>
              <div className="d-flex gap-2 justify-content-center">
                <Button variant="primary" size="sm" onClick={() => onEdit(user)} disabled={isDeleted}>
                  <FaEdit className="me-1" /> ערוך
                </Button>
                {isDeleted && onRestore ? (
                  <Button variant="success" size="sm" onClick={() => onRestore(user.user_id)}>
                    <FaUndoAlt className="me-1" /> שחזר
                  </Button>
                ) : (
                  <Button variant="danger" size="sm" onClick={() => onDelete(user.user_id)} disabled={isDeleted}>
                    <FaTrash className="me-1" /> מחק
                  </Button>
                )}
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);

export default UserTable;
