import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message,
  confirmText = 'Hapus',
  variant = 'danger'
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`p-3 rounded-full mb-4 ${variant === 'danger' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}>
          <AlertTriangle className="h-8 w-8" />
        </div>
        
        <p className="text-text-secondary text-sm mb-6">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            fullWidth
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            fullWidth
            loading={loading}
          >
            {loading ? "Menghapus..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
