// front-end/components/ApplyButton.tsx

import React, { useState } from 'react';
import ApplicationForm from './ApplicationForm';

interface ApplyButtonProps {
  jobId: number;
}

const ApplyButton: React.FC<ApplyButtonProps> = ({ jobId }) => {
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleApplyClick = () => {
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    // Optionally, refresh application overview or display a global success message
  };

  return (
    <div className="apply-button-container">
      <button onClick={handleApplyClick}>Apply</button>
      {showForm && <ApplicationForm jobId={jobId} onSuccess={handleFormSuccess} />}
    </div>
  );
};

export default ApplyButton;
