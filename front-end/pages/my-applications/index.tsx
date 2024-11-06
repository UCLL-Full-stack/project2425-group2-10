// front-end/pages/my-applications/index.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@components/header';
import { Application } from '@types';

const JobApplicationsOverview: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get<Application[]>('http://localhost:3000/applications');
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load job applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async (applicationId: number, newStatus: 'Applied' | 'Pending' | 'Interviewing' | 'Rejected' | 'Accepted') => {
    try {
      // Update status on the server
      await axios.put(`http://localhost:3000/applications/${applicationId}`, { status: newStatus });
      
      // Update state locally
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
      setError('Failed to update status. Please try again.');
    }
  };  

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Job Applications</h1>
        {loading ? (
          <p>Loading job applications...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div key={application.id} className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">{application.jobTitle}</h2>
                <p className="text-gray-600 mb-2">
                  <strong>Company:</strong> {application.companyName}
                </p>
                <p className="text-gray-800 mb-2">
                  <strong>Applied on:</strong> {new Date(application.appliedAt).toLocaleDateString()}
                </p>
                <div className="mb-2">
                  <label htmlFor={`status-${application.id}`} className="block text-gray-700 font-semibold mb-1">
                    Application Status:
                  </label>
                  <select
                    id={`status-${application.id}`}
                    value={application.status}
                    onChange={(e) => handleStatusChange(application.id, e.target.value as 'Applied' | 'Pending' | 'Interviewing' | 'Rejected' | 'Accepted')}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Pending">Pending</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Accepted">Accepted</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't applied for any jobs yet.</p>
        )}
      </main>
    </div>
  );
};

export default JobApplicationsOverview;
