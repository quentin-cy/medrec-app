import { createContext } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface IToast {
  toast: (title: string, description?: string, variant?: ToastVariant) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

export const ToastContext = createContext<IToast>({
  toast: () => {},
  success: () => {},
  error: () => {},
});
