import { useToastContext } from '../context/ToastContext';

/**
 * useToast - hook to trigger toast notifications from any component
 * @returns {{ showToast: (message: string, variant?: 'success'|'error'|'info') => void }}
 */
export function useToast() {
  const { showToast } = useToastContext();
  return { showToast };
}
