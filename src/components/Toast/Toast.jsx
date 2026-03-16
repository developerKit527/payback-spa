import React from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useToastContext } from '../../context/ToastContext';
import styles from './Toast.module.css';

const VARIANT_STYLES = {
  success: { bg: 'bg-green-600', Icon: CheckCircle },
  error:   { bg: 'bg-red-600',   Icon: XCircle },
  info:    { bg: 'bg-blue-600',  Icon: Info },
};

function Toast() {
  const { toasts } = useToastContext();

  if (!toasts.length) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
      data-testid="toast-container"
    >
      {toasts.map(({ id, message, variant }) => {
        const { bg, Icon } = VARIANT_STYLES[variant] || VARIANT_STYLES.info;
        return (
          <div
            key={id}
            className={`${styles.toast} ${bg} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-64 max-w-sm`}
            data-testid="toast"
            role="alert"
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        );
      })}
    </div>
  );
}

export default Toast;
