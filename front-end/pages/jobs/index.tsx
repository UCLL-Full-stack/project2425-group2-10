// front-end/pages/jobs/index.tsx

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/header';
import { Job } from '../../types';
import { ClipLoader } from 'react-spinners';

const JobListPage: React.FC = () => {
  const { isAuthenticated, token } = useContext(AuthContext);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get<Job[]>('http://localhost:3000/jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token]);

  const handleApply = (jobId: number) => {
    // This is where you would implement the apply functionality
    alert(`Applying for Job ID: ${jobId}`);
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
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-2">{job.jobTitle}</h2>
                <p className="text-gray-600 mb-4">{job.companyName}</p>
                <p className="text-gray-800">{job.description}</p>
                <button
                  onClick={() => handleApply(job.id)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
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

export default JobListPage;
