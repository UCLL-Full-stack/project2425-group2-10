// pages/index.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Job } from '@types';
import Header from '@components/header';

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 flex-grow">
        <h1 className="text-4xl font-bold my-8 text-center text-blue-600">Job Opportunities</h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading jobs...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-200 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 bg-white"
              >
                <h2 className="text-2xl font-semibold text-blue-600 mb-2">{job.jobTitle}</h2>
                <p className="text-gray-600 mb-4">{job.companyName}</p>
                <p className="text-gray-700 mb-4">{job.description}</p>
                <p className="text-gray-600 mb-2">
                  <strong>Status:</strong> {job.status}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Date:</strong> {new Date(job.date).toLocaleDateString()}
                </p>
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="mb-4">
                    <strong>Required Skills:</strong>
                    <ul className="list-disc list-inside text-gray-700">
                      {job.requiredSkills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <button className="mt-auto w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No job opportunities available at the moment.</p>
        )}
      </main>
      <footer className="bg-white py-4 mt-8 shadow">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} ApplyWise. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
