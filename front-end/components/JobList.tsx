// front-end/components/JobList.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApplyButton from './ApplyButton';

interface Job {
  id: number;
  companyName: string;
  jobTitle: string;
  date: string;
  status: string;
  description: string;
  requiredSkills: string[];
}

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/jobs'); // Adjust the endpoint as needed
      setJobs(response.data);
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
    fetchJobs();
  }, []);

  return (
    <div className="job-list">
      <h2>Job Opportunities</h2>
      {loading && <p>Loading jobs...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && jobs.length === 0 && <p>No jobs available at the moment.</p>}
      {!loading && !error && jobs.length > 0 && (
        <div className="jobs-container">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.jobTitle} at {job.companyName}</h3>
              <p>{job.description}</p>
              <p>Required Skills: {job.requiredSkills.join(', ')}</p>
              <p>Status: {job.status}</p>
              <ApplyButton jobId={job.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
