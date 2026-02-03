import React from 'react';
import { Accordion, Button, Badge, Image } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { type User } from '../../../types/user';

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

const UserMobileList: React.FC<Props> = ({ users, onEdit, onDelete }) => (
  <Accordion className="d-md-none">
    {users.map((user) => (
      <Accordion.Item eventKey={String(user.user_id)} key={user.user_id}>
        <Accordion.Header>
          <div className="d-flex align-items-center gap-2 w-100 pe-2" style={{ minWidth: 0 }}>
            <Image
              src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_name || user.email)}&background=random`}
              roundedCircle
              width={40}
              height={40}
              className="object-fit-cover flex-shrink-0"
            />
            <div className="text-end flex-grow-1" style={{ minWidth: 0 }}>
              <div className="fw-bold small text-truncate">{user.user_name || user.email}</div>
              <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>{user.email}</div>
            </div>
            <Badge bg={user.role === 'admin' ? 'danger' : 'secondary'} className="flex-shrink-0">
              {user.role === 'admin' ? 'מנהל' : 'משתמש'}
            </Badge>
          </div>
        </Accordion.Header>
        <Accordion.Body className="text-end">
          <div className="mb-2">
            <span className="text-muted">מזהה: </span>{user.user_id}
          </div>
          <div className="mb-2">
            <span className="text-muted">שם מלא: </span>
            {[user.first_name, user.last_name].filter(Boolean).join(' ') || '-'}
          </div>
          <div className="mb-2">
            <span className="text-muted">ספק: </span>
            <Badge bg={user.provider === 'google' ? 'info' : 'light'} text={user.provider === 'google' ? 'white' : 'dark'}>
              {user.provider === 'google' ? 'Google' : 'רגיל'}
            </Badge>
          </div>
          <div className="mb-3">
            <span className="text-muted">הצטרפות: </span>
            {user.created_at ? new Date(user.created_at).toLocaleDateString('he-IL') : '-'}
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <Button variant="primary" size="sm" onClick={() => onEdit(user)}>
              <FaEdit className="me-1" /> ערוך
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(user.user_id)}>
              <FaTrash className="me-1" /> מחק
            </Button>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    ))}
  </Accordion>
);

export default UserMobileList;
