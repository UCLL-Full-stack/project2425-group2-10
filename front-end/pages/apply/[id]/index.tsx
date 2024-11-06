// front-end/pages/apply/[id]/index.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@components/header';
import Spinner from '@components/Spinner';
import axios from 'axios';
import { Job } from '@types';

const ApplyPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Job ID from URL

  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    resume: null as File | null,
    coverLetter: null as File | null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, files } = e.target;
    if (name === 'resume' || name === 'coverLetter') {
      setFormData({
        ...formData,
        [name]: files ? files[0] : null,
      });
      setErrors({ ...errors, [name]: '' });
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: '' });
    }
    setSubmitError('');
    setSubmitSuccess('');
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.applicantName.trim()) newErrors.applicantName = 'Name is required.';
    if (!formData.applicantEmail) newErrors.applicantEmail = 'Email is required.';
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.applicantEmail)
    )
      newErrors.applicantEmail = 'Invalid email address.';
    if (!formData.resume) newErrors.resume = 'Resume is required.';
    else if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(formData.resume.type))
      newErrors.resume = 'Invalid resume format. Only PDF and DOCX are allowed.';
    if (!formData.coverLetter) newErrors.coverLetter = 'Cover Letter is required.';
    else if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(formData.coverLetter.type))
      newErrors.coverLetter = 'Invalid cover letter format. Only PDF and DOCX are allowed.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare form data for submission
    const data = new FormData();
    data.append('applicantName', formData.applicantName);
    data.append('applicantEmail', formData.applicantEmail);
    if (formData.resume) data.append('resume', formData.resume);
    if (formData.coverLetter) data.append('coverLetter', formData.coverLetter);

    try {
      setIsSubmitting(true);
      setSubmitError('');
      setSubmitSuccess('');

      const response = await axios.post(`http://localhost:3000/jobs/${id}/apply`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSubmitSuccess('Application submitted successfully! Redirecting to job overview...');
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/my-applications');
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setSubmitError(error.response.data.message);
      } else {
        setSubmitError('Failed to submit application. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Optionally, fetch job details for display
  const [jobDetails, setJobDetails] = useState<Job | null>(null);
  const [jobLoading, setJobLoading] = useState<boolean>(true);
  const [jobError, setJobError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchJobDetails = async () => {
      try {
        const response = await axios.get<Job[]>(`http://localhost:3000/jobs`);
        const job = response.data.find((j) => j.id === parseInt(id as string, 10));
        if (job) {
          setJobDetails(job);
        } else {
          setJobError('Job not found.');
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        setJobError('Failed to load job details. Please try again later.');
      } finally {
        setJobLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {jobLoading ? (
          <p>Loading job details...</p>
        ) : jobError ? (
          <p className="text-red-500">{jobError}</p>
        ) : jobDetails ? (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6 text-center">Apply for {jobDetails.jobTitle} at {jobDetails.companyName}</h1>
            {submitSuccess && (
              <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-center">
                {submitSuccess}
              </div>
            )}
            {submitError && (
              <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-center">
                {submitError}
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
              {/* Applicant Name */}
              <div className="mb-4">
                <label
                  htmlFor="applicantName"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="applicantName"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full p-2 border ${
                    errors.applicantName ? 'border-red-500' : 'border-gray-300'
                  } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-describedby="applicantName-error"
                />
                {errors.applicantName && (
                  <p id="applicantName-error" className="text-red-500 text-sm mt-1">
                    {errors.applicantName}
                  </p>
                )}
              </div>
              {/* Applicant Email */}
              <div className="mb-4">
                <label
                  htmlFor="applicantEmail"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="applicantEmail"
                  name="applicantEmail"
                  value={formData.applicantEmail}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full p-2 border ${
                    errors.applicantEmail ? 'border-red-500' : 'border-gray-300'
                  } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-describedby="applicantEmail-error"
                />
                {errors.applicantEmail && (
                  <p id="applicantEmail-error" className="text-red-500 text-sm mt-1">
                    {errors.applicantEmail}
                  </p>
                )}
              </div>
              {/* Resume Upload */}
              <div className="mb-4">
                <label
                  htmlFor="resume"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Resume<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.resume ? 'border-red-500' : 'border-gray-300'
                  } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-describedby="resume-error"
                />
                {errors.resume && (
                  <p id="resume-error" className="text-red-500 text-sm mt-1">
                    {errors.resume}
                  </p>
                )}
              </div>
              {/* Cover Letter Upload */}
              <div className="mb-6">
                <label
                  htmlFor="coverLetter"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Cover Letter<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="coverLetter"
                  name="coverLetter"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.coverLetter ? 'border-red-500' : 'border-gray-300'
                  } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-describedby="coverLetter-error"
                />
                {errors.coverLetter && (
                  <p id="coverLetter-error" className="text-red-500 text-sm mt-1">
                    {errors.coverLetter}
                  </p>
                )}
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition-colors ${
                  isSubmitting ? 'bg-green-300 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting Application...' : 'Apply'}
              </button>
              {/* Loading Spinner */}
              {isSubmitting && <Spinner />}
            </form>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default ApplyPage;
