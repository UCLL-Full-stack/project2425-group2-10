// front-end/components/ApplicationForm.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ApplicationFormProps {
  jobId: number;
  onSuccess: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ jobId, onSuccess }) => {
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverLetter(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!resume || !coverLetter) {
      setError('Please upload both resume and cover letter.');
      return;
    }
  
    const formData = new FormData();
    formData.append('jobId', jobId.toString());
    formData.append('resume', resume);
    formData.append('coverLetter', coverLetter);
  
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
  
      const response = await axios.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast.success(response.data.message);
      onSuccess(); // Callback to refresh application overview or perform other actions
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-form">
      <h2>Apply for this Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="resume">Resume (PDF, DOC, DOCX):</label>
          <input
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            required
          />
        </div>
        <div>
          <label htmlFor="coverLetter">Cover Letter (PDF, DOC, DOCX):</label>
          <input
            type="file"
            id="coverLetter"
            accept=".pdf,.doc,.docx"
            onChange={handleCoverLetterChange}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
