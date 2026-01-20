import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

export interface ToastMessage {
  id: string;
  message: string;
  variant: 'success' | 'danger' | 'warning' | 'info';
  show: boolean;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onClose }) => {
  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          show={toast.show}
          onClose={() => onClose(toast.id)}
          delay={3000}
          autohide
          bg={toast.variant}
        >
          <Toast.Header closeButton>
            <strong className="me-auto">
              {toast.variant === 'success' && '✅ הצלחה'}
              {toast.variant === 'danger' && '❌ שגיאה'}
              {toast.variant === 'warning' && '⚠️ אזהרה'}
              {toast.variant === 'info' && 'ℹ️ מידע'}
            </strong>
          </Toast.Header>
          <Toast.Body className={toast.variant === 'success' ? 'text-white' : ''}>
            {toast.message}
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default ToastNotification;
