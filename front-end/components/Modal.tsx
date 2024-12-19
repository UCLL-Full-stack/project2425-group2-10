// front-end/components/Modal.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const { t } = useTranslation('common');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={t('close')}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
