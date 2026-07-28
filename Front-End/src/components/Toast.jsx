import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useApp();

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-success" />,
    error: <XCircle className="h-5 w-5 text-danger" />,
    info: <Info className="h-5 w-5 text-primary" />,
  };

  const borderColors = {
    success: 'border-success/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    error: 'border-danger/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    info: 'border-primary/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]',
  };

  return (
    <div className="fixed top-6 right-6 z-[999] flex flex-col gap-3 max-w-sm w-full pointer-events-none" aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            role="alert"
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`bg-surface border ${borderColors[toast.type]} rounded-xl p-4 shadow-xl flex items-start gap-3 pointer-events-auto transition-shadow duration-300`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {icons[toast.type]}
            </div>
            
            <div className="flex-grow">
              <p className="text-text text-sm font-medium text-left leading-snug">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Tutup notifikasi"
              className="text-text-muted hover:text-text p-1 hover:bg-surface-hover rounded-lg transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
