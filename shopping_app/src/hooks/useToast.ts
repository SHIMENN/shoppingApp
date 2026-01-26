import { useState, useCallback } from 'react';
// ייבוא מקובץ הטיפוסים המרכזי שבו הגדרת את הממשק
import { type ToastMessage } from '../types/admin'; 

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, variant: ToastMessage['variant'] = 'info') => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, message, variant, show: true };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  return { toasts, showToast, removeToast };
};