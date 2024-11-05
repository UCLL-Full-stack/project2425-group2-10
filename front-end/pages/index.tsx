// front-end/pages/index.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Job } from '@types';
import Header from '@components/header';
import Link from 'next/link';

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
              <div key={job.id} className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
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
                <div className="mt-4">
                  <Link href={`/apply/${job.id}`} className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
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
        <div className="mt-8 text-center">
          <Link href="/add-job" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Add New Job
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
