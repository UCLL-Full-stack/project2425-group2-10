// front-end/pages/index.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Job } from '@types';
import Header from '@components/header';
import Link from 'next/link';
import Spinner from '@components/Spinner';
import { XIcon } from '@heroicons/react/solid';

const HomePage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get<Job[]>('http://localhost:3000/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const discardJob = async (jobId: number) => {
    if (!confirm('Are you sure you want to discard this job? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/jobs/${jobId}`);
      // Remove the job from the state
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      alert('Job discarded successfully.');
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
        <h1 className="text-3xl font-bold mb-6">Job Opportunities</h1>
        {loading ? (
          <p>Loading jobs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow flex flex-col justify-between relative">
                {/* Discard X Icon */}
                <button
                  onClick={() => discardJob(job.id)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none"
                  aria-label="Discard Job"
                >
                  {/* X Icon SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Job Content */}
                <div className="flex-grow">
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
                <div className="flex justify-center mt-4">
                  <Link href={`/apply/${job.id}`} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                    Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No job opportunities available at the moment.</p>
        )}
        {/* Add a link to add a new job for convenience */}
        {/* <div className="mt-8 text-center">
          <Link href="/add-job" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Add New Job
          </Link>
        </div> */}
      </main>
    </div>
  );
};

export default HomePage;