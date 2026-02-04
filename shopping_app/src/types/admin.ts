/**
 * טיפוסים משותפים - טפסים, הודעות Toast, וכפתורי התחברות חברתית
 */

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  image_url?: string;
}
export interface SocialButtonsProps {
  onGoogleLogin: () => void;
}
export interface ToastMessage {//hooks/useRequireAuth.ts
  id: string;
  message: string;
  variant: 'success' | 'danger' | 'warning' | 'info';
  show: boolean;
}
export interface ToastNotificationProps {//components/common/ToastNotification.tsx
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}
