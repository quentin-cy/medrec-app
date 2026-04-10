import {
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import './Toast.css';
import {
  ToastContext,
  type IToast,
  type ToastVariant,
} from './ToastContext.tsx';

interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}


let toastId = 0;

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success: 'toast-success',
  error: 'toast-error',
  info: 'toast-info',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (title: string, description?: string, variant: ToastVariant = 'info') => {
      const id = ++toastId;
      setToasts(prev => [...prev, { id, title, description, variant }]);
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const contextValue: IToast = {
    toast: addToast,
    success: (title, description) => addToast(title, description, 'success'),
    error: (title, description) => addToast(title, description, 'error'),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      <ToastPrimitive.Provider swipeDirection="right" duration={4000}>
        {children}
        {toasts.map(t => (
          <ToastPrimitive.Root
            key={t.id}
            className={`toast-root ${VARIANT_CLASSES[t.variant]}`}
            onOpenChange={open => {
              if (!open) removeToast(t.id);
            }}
          >
            <ToastPrimitive.Title className="toast-title">
              {t.title}
            </ToastPrimitive.Title>
            {t.description && (
              <ToastPrimitive.Description className="toast-description">
                {t.description}
              </ToastPrimitive.Description>
            )}
            <ToastPrimitive.Close className="toast-close">
              &times;
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="toast-viewport" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}


