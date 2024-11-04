// front-end/components/JobCard.tsx

import React from 'react';
import ApplyButton from './ApplyButton';

interface JobCardProps {
  job: {
    id: number;
    companyName: string;
    jobTitle: string;
    date: string;
    status: string;
    description: string;
    requiredSkills: string[];
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="job-card">
      <h3>{job.jobTitle} at {job.companyName}</h3>
      <p>{job.description}</p>
      <p>Required Skills: {job.requiredSkills.join(', ')}</p>
      <p>Status: {job.status}</p>
      <ApplyButton jobId={job.id} />
    </div>
  );
};

export default JobCard;
