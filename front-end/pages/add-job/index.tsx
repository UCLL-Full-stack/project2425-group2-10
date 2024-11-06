// front-end/pages/add-job/index.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '@components/header'; // Adjust the import path as needed

interface Job {
    companyName: string;
    jobTitle: string;
    date: string;
    status: string;
    description?: string;
    requiredSkills?: string[];
}

const AddJob: React.FC = () => {
    const [job, setJob] = useState<Job>({
        companyName: '',
        jobTitle: '',
        date: '',
        status: '',
        description: '',
        requiredSkills: [],
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setJob(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setJob(prev => {
            const skills = prev.requiredSkills || [];
            if (checked) {
                return { ...prev, requiredSkills: [...skills, value] };
            } else {
                return { ...prev, requiredSkills: skills.filter(skill => skill !== value) };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setTimeout(() => {
          router.push('/');
        }, 2000);

        // Basic validation
        if (!job.companyName || !job.jobTitle || !job.date || !job.status) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/jobs', job);
            setSuccess(response.data.message);
            // Optionally, redirect to another page
            // router.push('/jobs');
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred.');
            }
            console.error('Error adding job:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Add New Job</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label htmlFor="companyName" className="block text-gray-700 font-semibold mb-2">
                            Company Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={job.companyName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="jobTitle" className="block text-gray-700 font-semibold mb-2">
                            Job Title<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="jobTitle"
                            name="jobTitle"
                            value={job.jobTitle}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="date" className="block text-gray-700 font-semibold mb-2">
                            Date<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={job.date}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="status" className="block text-gray-700 font-semibold mb-2">
                            Status<span className="text-red-500">*</span>
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={job.status}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={job.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <span className="block text-gray-700 font-semibold mb-2">Required Skills</span>
                        <div className="flex flex-wrap">
                            {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'Python', 'SQL', 'Data Visualization', 'Excel'].map(skill => (
                                <label key={skill} className="mr-4 mb-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        name="requiredSkills"
                                        value={skill}
                                        checked={job.requiredSkills?.includes(skill) || false}
                                        onChange={handleSkillsChange}
                                        className="mr-2"
                                    />
                                    {skill}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Add Job
                    </button>
                </form>
            </main>
        </div>
    );
};

export default AddJob;
