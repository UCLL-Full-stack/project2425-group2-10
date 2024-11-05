// front-end/pages/login/index.tsx

import React, { useState } from 'react';
import Header from '@components/header';
import { useRouter } from 'next/router';
import Spinner from '@components/Spinner';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when the user starts typing
    setErrors({ ...errors, [e.target.name]: '' });
    setSubmitError('');
    setSubmitSuccess('');
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    )
      newErrors.email = 'Invalid email address.';
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Mock form submission
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful login
      setSubmitSuccess('Login successful! Redirecting...');
      // Redirect to home after a short delay
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      // Mock error handling
      setSubmitError('Failed to login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
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
            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2"
              >
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full p-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-describedby="email-error"
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>
            {/* Password Field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-2"
              >
                Password<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full p-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-describedby="password-error"
              />
              {errors.password && (
                <p id="password-error" className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors ${
                isSubmitting ? 'bg-blue-300 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
            {/* Loading Spinner */}
            {isSubmitting && <Spinner />}
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
