// front-end/pages/index.tsx

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Header from '../components/header';
import { AuthContext } from '../context/AuthContext';
import { Job } from '../types';
import { ClipLoader } from 'react-spinners';

const HomePage: React.FC = () => {
  const { isAuthenticated, token, role } = useContext(AuthContext);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Job[]>('http://localhost:3000/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchJobs();
    } else {
      setLoading(false); // Allow unauthenticated access to see job listings
    }
  }, [isAuthenticated, token]);

  const handleApplyClick = (jobId: number) => {
    setApplyingJobId(jobId); // Show the apply form for the selected job
  };

  const handleSubmitApplication = async (jobId: number) => {
    if (!resume || !coverLetter) {
      setMessage('Please upload both resume and cover letter.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('coverLetter', coverLetter);

    try {
      await axios.post(`http://localhost:3000/jobs/${jobId}/apply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Application submitted successfully!');
      setApplyingJobId(null); // Hide the form after submission
      setResume(null);
      setCoverLetter(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      setMessage('Failed to submit application.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Job Opportunities</h1>

        {loading ? (
          <div className="flex justify-center">
            <ClipLoader size={50} color="#2563EB" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{job.jobTitle}</h2>
                  <p className="text-gray-600 mb-4">{job.companyName}</p>
                  <p className="text-gray-800">{job.description}</p>
                  <p className="mt-4">
                    <strong>Status:</strong> {job.status}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(job.date).toLocaleDateString()}
                  </p>
                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <p className="mt-2">
                      <strong>Required Skills:</strong> {job.requiredSkills.join(', ')}
                    </p>
                  )}
                </div>

                {/* Apply Button or Upload Form */}
                {applyingJobId === job.id ? (
                  <div className="mt-4">
                    {/* File inputs for resume and cover letter */}
                    <label className="block mb-2 font-semibold text-gray-700">
                      Resume
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResume(e.target.files ? e.target.files[0] : null)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded"
                      />
                    </label>

                    <label className="block mb-2 font-semibold text-gray-700">
                      Cover Letter
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCoverLetter(e.target.files ? e.target.files[0] : null)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded"
                      />
                    </label>

                    <button
                      onClick={() => handleSubmitApplication(job.id)}
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition-colors w-full"
                    >
                      Submit Application
                    </button>

                    {message && <p className="mt-2 text-green-600">{message}</p>}
                  </div>
                ) : (
                  <button
                    onClick={() => handleApplyClick(job.id)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition-colors self-center"
                  >
                    Apply
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No job opportunities available at the moment.</p>
        )}
      </main>
    </div>
  );
};

export default HomePage;
