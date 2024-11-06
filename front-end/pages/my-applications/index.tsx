// front-end/pages/my-applications/index.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@components/header';
import { Application } from '@types';
import Spinner from '@components/Spinner';

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

  const discardJob = async (jobId: number) => {
    if (!confirm('Are you sure you want to discard this job? This will delete the job and all associated applications. This action cannot be undone.')) {
        return;
    }

    try {
        await axios.delete(`http://localhost:3000/jobs/${jobId}`);
        // Remove the job and its applications from the state
        setApplications(prevApps => prevApps.filter(app => app.jobId !== jobId));
        alert('Job and related applications discarded successfully.');
    } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to discard the job. Please try again.');
        console.error('Error discarding job:', err);
    }
};

if (loading) return <Spinner />;

if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">My Applications</h1>
                {applications.length === 0 ? (
                    <p>No applications found.</p>
                ) : (
                    <div className="space-y-4">
                        {applications.map(app => (
                            <div key={app.id} className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-xl font-semibold mb-2">{app.jobTitle} at {app.companyName}</h2>
                                <p className="text-gray-600 mb-1"><strong>Applied On:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                                <p className="text-gray-600 mb-1"><strong>Status:</strong> {app.status}</p>
                                <div className="flex justify-between items-center">
                                    <a href={app.resumeUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">View Resume</a>
                                    <a href={app.coverLetterUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">View Cover Letter</a>
                                    <button
                                        onClick={() => discardJob(app.jobId)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                    >
                                        Discard Job
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default JobApplicationsOverview;
