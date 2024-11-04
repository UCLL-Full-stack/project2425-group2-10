// front-end/pages/add-job/index.tsx

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../../components/header';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners'; // For loading indicator

const AddJobPage: React.FC = () => {
  const { isAuthenticated, token } = useContext(AuthContext);
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    date: '',
    status: '',
    description: '',
    requiredSkills: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when the user starts typing
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.companyName)
      newErrors.companyName = 'Company Name is required.';
    if (!formData.jobTitle) newErrors.jobTitle = 'Job Title is required.';
    if (!formData.date) newErrors.date = 'Date is required.';
    if (!formData.status) newErrors.status = 'Status is required.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Prepare data for submission
    const data = {
      companyName: formData.companyName,
      jobTitle: formData.jobTitle,
      date: formData.date,
      status: formData.status,
      description: formData.description,
      requiredSkills: formData.requiredSkills
        .split(',')
        .map((skill) => skill.trim()),
    };

    try {
      const response = await axios.post('http://localhost:3000/jobs', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message);
      // Redirect to job overview
      router.push('/');
      // Optionally, clear the form
      setFormData({
        companyName: '',
        jobTitle: '',
        date: '',
        status: '',
        description: '',
        requiredSkills: '',
      });
    } catch (error) {
      console.error('Error adding job:', error);
      toast.error(
        (error as any).response?.data?.message || 'Failed to add job. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Add New Job Opportunity</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          {/* Company Name */}
          <div className="mb-4">
            <label
              htmlFor="companyName"
              className="block text-gray-700 font-semibold mb-2"
            >
              Company Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className={`w-full p-2 border ${
                errors.companyName ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-describedby="companyName-error"
            />
            {errors.companyName && (
              <p
                id="companyName-error"
                className="text-red-500 text-sm mt-1"
              >
                {errors.companyName}
              </p>
            )}
          </div>
          {/* Job Title */}
          <div className="mb-4">
            <label
              htmlFor="jobTitle"
              className="block text-gray-700 font-semibold mb-2"
            >
              Job Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Enter job title"
              className={`w-full p-2 border ${
                errors.jobTitle ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-describedby="jobTitle-error"
            />
            {errors.jobTitle && (
              <p id="jobTitle-error" className="text-red-500 text-sm mt-1">
                {errors.jobTitle}
              </p>
            )}
          </div>
          {/* Date */}
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-gray-700 font-semibold mb-2"
            >
              Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full p-2 border ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-describedby="date-error"
            />
            {errors.date && (
              <p id="date-error" className="text-red-500 text-sm mt-1">
                {errors.date}
              </p>
            )}
          </div>
          {/* Status */}
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-gray-700 font-semibold mb-2"
            >
              Status<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="e.g., Open, Closed, Interviewing"
              className={`w-full p-2 border ${
                errors.status ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-describedby="status-error"
            />
            {errors.status && (
              <p id="status-error" className="text-red-500 text-sm mt-1">
                {errors.status}
              </p>
            )}
          </div>
          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-semibold mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter job description"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Required Skills */}
          <div className="mb-6">
            <label
              htmlFor="requiredSkills"
              className="block text-gray-700 font-semibold mb-2"
            >
              Required Skills (comma-separated)
            </label>
            <input
              type="text"
              id="requiredSkills"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Node.js"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting && (
              <ClipLoader size={20} color="#ffffff" className="mr-2" />
            )}
            {isSubmitting ? 'Adding...' : 'Add Job'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddJobPage;
