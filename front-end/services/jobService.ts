import { Job } from '../types';

const getJobs = () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getJobById = (jobId: number) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const createJob = (jobData: Partial<Job>) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobData),
  });
};

const deleteJob = (jobId: number) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Apply for a job by uploading resume and cover letter.
 * `formData` should include fields:
 * - applicantName: string
 * - applicantEmail: string
 * - resume: File
 * - coverLetter: File
 */
const applyForJob = (jobId: number, formData: FormData) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/apply`, {
    method: 'POST',
    // For FormData, 'Content-Type' is automatically set with the correct boundary.
    body: formData,
  });
};

const JobService = {
  getJobs,
  getJobById,
  createJob,
  deleteJob,
  applyForJob,
};

export default JobService;