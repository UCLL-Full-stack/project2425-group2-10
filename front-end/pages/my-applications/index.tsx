// front-end/pages/my-applications/index.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@components/header';
import { Application } from '@types';
import Spinner from '@components/Spinner';
import { XIcon } from '@heroicons/react/solid';
import Link from 'next/link';

const JobApplicationsOverview: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [notesError, setNotesError] = useState<string>('');

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

  const discardApplication = async (applicationId: number) => {
    if (!confirm('Are you sure you want to discard this job application? This will delete the job and all associated applications. This action cannot be undone.')) {
        return;
    }

    try {
        await axios.delete(`http://localhost:3000/applications/${applicationId}`);
        // Remove the job and its applications from the state
        setApplications(prevApps => prevApps.filter(app => app.id !== applicationId));
        alert('Job and related applications discarded successfully.');
    } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to discard the job application. Please try again.');
        console.error('Error discarding job application:', err);
    }
};

  const startEditingNotes = (applicationId: number, currentNotes: string) => {
    setEditingNotesId(applicationId);
    setNotes(currentNotes || '');
    setNotesError('');
  };

  const cancelEditingNotes = () => {
    setEditingNotesId(null);
    setNotes('');
    setNotesError('');
  };

  const saveNotes = async (applicationId: number) => {
    if (notes.trim().length === 0) {
      setNotesError('Notes cannot be empty.');
      return;
    }

    try {
      // Update notes on the server
      await axios.put(`http://localhost:3000/applications/${applicationId}/notes`, { notes });

      // Update state locally
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, notes } : app
        )
      );

      setEditingNotesId(null);
      setNotes('');
      setNotesError('');
    } catch (error) {
      console.error('Error updating notes:', error);
      setNotesError('Failed to save notes. Please try again.');
    }
  };

  if (loading) return <Spinner />;

  if (error) return <p className="text-red-500">{error}</p>;

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
              <div key={application.id} className="bg-white p-6 rounded-lg shadow flex flex-col justify-between relative">
                {/* Discard X Icon */}
                <button
                  onClick={() => discardApplication(application.id)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none"
                  aria-label="Discard Job"
                >
                  {/* X Icon SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
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
                <div className="pt-3 flex justify-between items-center">
                    <a href={application.resumeUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">View Resume</a>
                    <a href={application.coverLetterUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">View Cover Letter</a>
                </div>

                {/* Notes Section */}
                <div className="mt-4">
                  {editingNotesId === application.id ? (
                    <div>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your notes here..."
                      ></textarea>
                      {notesError && <p className="text-red-500 text-sm mt-1">{notesError}</p>}
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={() => saveNotes(application.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingNotes}
                          className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor={`notes-${application.id}`} className="block text-gray-700 font-semibold mb-1">
                        Notes:
                      </label>
                      <p className="text-gray-800 mb-2">{application.notes || 'No notes added.'}</p>
                      <button
                        onClick={() => startEditingNotes(application.id, application.notes || '')}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        Add/Edit Notes
                      </button>
                    </div>
                  )}
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
