import React, { useEffect, useState } from 'react';
import Header from '@components/header';
import Link from 'next/link';
import { Job } from '../types';
import JobService from '../services/jobService'; // Import the updated jobService
import Spinner from '@components/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getJobs = async () => {
            setLoading(true);
            setError(null);

            try {
                // fetchJobs now returns a fetch Promise.
                const response = await JobService.getJobs();
                if (!response.ok) {
                    // Extract the error message from the response
                    const errorData = await response.json();
                    const errorMessage = errorData.message || 'Failed to load jobs. Please try again later.';
                    setError(errorMessage);
                    toast.error(errorMessage);
                } else {
                    const data: Job[] = await response.json();
                    setJobs(data);
                }
            } catch (err: any) {
                console.error('Error fetching jobs:', err);
                const errorMessage = err.message || 'Failed to load jobs. Please try again later.';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        getJobs();
    }, []);

    const handleDelete = async (jobId: number) => {
        if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;

        try {
            const response = await JobService.deleteJob(jobId);
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to delete the job. Please try again.';
                toast.error(errorMessage);
            } else {
                setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
                toast.success('Job deleted successfully.');
            }
        } catch (err: any) {
            console.error('Error deleting job:', err);
            const errorMessage = err.message || 'Failed to delete the job. Please try again.';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Job Opportunities</h1>
                {loading ? (
                    <Spinner />
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <div key={job.id} className="bg-white p-6 rounded-lg shadow flex flex-col justify-between relative">
                                {/* Discard X Icon */}
                                <button
                                    onClick={() => handleDelete(job.id)}
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
                                    {job.skills && job.skills.length > 0 && (
                                        <p className="mt-2">
                                            <strong>Required Skills:</strong> {job.skills.join(', ')}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-center mt-4">
                                    <Link
                                        href={`/apply/${job.id}`}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                                    >
                                        Apply
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No job opportunities available at the moment.</p>
                )}
            </main>

            {/* Toast Notifications */}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default HomePage;