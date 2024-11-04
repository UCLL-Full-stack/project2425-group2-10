// front-end/components/ApplicationOverview.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Application {
    id: number;
    jobId: number;
    userId: number;
    resumePath: string;
    coverLetterPath: string;
    status: 'Applied' | 'Reviewed' | 'Rejected' | 'Accepted';
    appliedAt: string;
    jobTitle: string;
    companyName: string;
  }

const ApplicationOverview: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

      const response = await axios.get('/applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(response.data);
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

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="application-overview">
      <h2>Your Applications</h2>
      {loading && <p>Loading applications...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && applications.length === 0 && <p>You have not applied to any jobs yet.</p>}
      {!loading && !error && applications.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Status</th>
              <th>Applied At</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{/* Fetch job title using jobId */}</td>
                <td>{/* Fetch company name using jobId */}</td>
                <td>{app.status}</td>
                <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicationOverview;
