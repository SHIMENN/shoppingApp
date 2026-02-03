import React from 'react';
import { Table, Button, Badge, Image } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { type User } from '../../../types/user';

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

const UserTable: React.FC<Props> = ({ users, onEdit, onDelete }) => (
  <Table striped bordered hover responsive className="text-end shadow-sm d-none d-md-table">
    <thead className="table-dark">
      <tr>
        <th>תמונה</th>
        <th>מזהה</th>
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
      {users.map((user) => (
        <tr key={user.user_id}>
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
              <Button variant="primary" size="sm" onClick={() => onEdit(user)}>
                <FaEdit className="me-1" /> ערוך
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(user.user_id)}>
                <FaTrash className="me-1" /> מחק
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default UserTable;
