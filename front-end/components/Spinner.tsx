// front-end/components/Spinner.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';

const Spinner: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="flex justify-center my-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-4">{t('loading')}</span>
    </div>
  );
};

export default Spinner;
