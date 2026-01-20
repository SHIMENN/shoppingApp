import { useState, useCallback } from 'react';
import type { ToastMessage } from '../components/common/ToastNotification';

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastMessage['variant'] = 'info') => {
      const id = Date.now().toString();
      const newToast: ToastMessage = {
        id,
        message,
        variant,
        show: true,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove after 3 seconds
      setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
  };
};
