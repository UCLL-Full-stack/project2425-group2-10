import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";  // Use Next.js useRouter hook
import JobService from "@services/JobService";  // Import the service to fetch a single job
import Navbar from "@components/Navbar";  
import Home from "@components/Home";// Import the Navbar component

const JobDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;  // Get the job ID from the URL
  const [job, setJob] = useState<any | null>(null);  // State to store job details
  const [loading, setLoading] = useState<boolean>(true);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state

  useEffect(() => {
    const loadJobDetail = async () => {
      if (!id) return;  // Wait for `id` to be available

      try {
        const jobData = await JobService.fetchJobById(id as string);  // Fetch the job details by ID
        setJob(jobData);  // Set the fetched job data in state
      } catch (error) {
        setError("Failed to fetch job details.");
        console.error("Failed to fetch job details", error);
      } finally {
        setLoading(false);  // Set loading to false after data is fetched or error occurred
      }
    };

    loadJobDetail();  // Fetch job details when the component mounts or when `id` changes
  }, [id]);  // This effect depends on the `id`, so it will run whenever `id` changes

  if (loading) return <div><Navbar /> Loading...</div>;  // Show loading message while the job details are being fetched
  if (error) return <div><Navbar /> {error}</div>;  // Show error message if there was an issue fetching the job
  if (!job) return <div><Navbar /> Job not found.</div>;  // Show message if no job is found for the given ID

  return (
    <div>
      <Navbar />  {/* Include the Navbar at the top of the page */}
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">{job.title}</h2>
        <h4 className="text-xl font-medium text-gray-600 mb-2">{job.companyName}</h4>
        <p className="text-gray-700 mb-4">{job.description}</p>
        <h5 className="text-lg font-semibold text-gray-700">Required Skills</h5>
        <p className="text-gray-600 mb-4">{job.skills}</p>
        <h5 className="text-lg font-semibold text-gray-700">Experience</h5>
        <p className="text-gray-600 mb-4">{job.experience}</p>
        <div className="flex justify-between items-center">
          <span
            className={`text-sm px-3 py-1 rounded-full ${
              job.status === "Open"
                ? "bg-green-100 text-green-600"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {job.status}
          </span>
          <button
            onClick={() => router.push(`/apply/${job.id}`)}  // Navigate to the apply page
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Apply Now
          </button>
        </div>
      </div>
      <Home />
    </div>
  );
};

export default JobDetailPage;