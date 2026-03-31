import {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import styles from './Toast.module.css';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (title: string, description?: string, variant?: ToastVariant) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastId = 0;

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

  const contextValue: ToastContextValue = {
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
            className={`${styles.root} ${styles[t.variant]}`}
            onOpenChange={open => {
              if (!open) removeToast(t.id);
            }}
          >
            <ToastPrimitive.Title className={styles.title}>
              {t.title}
            </ToastPrimitive.Title>
            {t.description && (
              <ToastPrimitive.Description className={styles.description}>
                {t.description}
              </ToastPrimitive.Description>
            )}
            <ToastPrimitive.Close className={styles.close}>
              &times;
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className={styles.viewport} />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
