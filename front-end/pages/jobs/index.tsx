import React, { useEffect, useState } from "react";
import JobCard from "@components/JobCard"; // Import the JobCard component
import { Job } from "../../types"; // Assuming the Job type is defined in front-end/types
import JobService from "@services/JobService"; // Import the JobService to fetch jobs
import Navbar from "@components/Navbar"; 

const JobListPage: React.FC = () => {
  // Define the state types explicitly
  const [jobs, setJobs] = useState<Job[]>([]);  // State to store fetched job listings
  const [loading, setLoading] = useState<boolean>(true);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state

  // Function to fetch jobs from the API
  const loadJobs = async () => {
    try {
      const jobList = await JobService.fetchJobs();  // Fetch jobs using the fetchJobs function from JobService
      setJobs(jobList);  // Set the fetched jobs to state
    } catch (error: any) {
      setError(`Failed to fetch jobs: ${error.message}`);  // Set error message if an error occurs
    } finally {
      setLoading(false);  // Set loading to false once the fetch is complete
    }
  };

  useEffect(() => {
    loadJobs();  // Call loadJobs when the component mounts
  }, []);

  // If loading, display a loading message
  if (loading) {
    return (
      <div>
        <Navbar />  {/* Display the Navbar */}
        <div>Loading...</div>
      </div>
    );
  }

  // If there is an error, display the error message
  if (error) {
    return (
      <div>
        <Navbar />  {/* Display the Navbar */}
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />  {/* Display the Navbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />  // Render each job as a JobCard component
        ))}
      </div>
    </div>
  );
};

export default JobListPage;