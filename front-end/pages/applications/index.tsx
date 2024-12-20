import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ApplicationService from "@services/ApplicationService";  // Import the service to fetch applications
import { Application } from "../../types"; // Use the Application type from types.ts
import Navbar from "@components/Navbar";  // Import Navbar component

const JobApplicationsPage: React.FC = () => {
  const router = useRouter();
  const { jobId } = router.query;  // Get the job ID from the URL query parameter

  const [applications, setApplications] = useState<Application[]>([]);  // State to store applications
  const [loading, setLoading] = useState<boolean>(true);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state

  useEffect(() => {
    const loadApplications = async () => {
      if (!jobId) return;  // If there's no jobId, do not proceed

      try {
        const data = await ApplicationService.getApplicationsByJobId(jobId as string);  // Fetch applications for the job
        setApplications(data);  // Set the fetched applications to state
      } catch (error: any) {
        setError("Failed to fetch applications.");  // Set error if fetching fails
        console.error(error);
      } finally {
        setLoading(false);  // Set loading to false once fetch is complete
      }
    };

    loadApplications();  // Load applications when the component mounts or jobId changes
  }, [jobId]);

  if (loading) return (
    <div>
      <Navbar />  {/* Include Navbar */}
      <div>Loading...</div>
    </div>
  );  // Show loading message while fetching

  if (error) return (
    <div>
      <Navbar />  {/* Include Navbar */}
      <div>{error}</div>
    </div>
  );  // Show error message if something goes wrong

  return (
    <div>
      <Navbar />  {/* Include Navbar */}
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Applications for Job</h2>
        {applications.length > 0 ? (
          <div>
            {applications.map((application) => (
              <div key={application.id} className="mb-4 p-4 border rounded-md">
                <h3 className="text-xl font-semibold">{application.fullName}</h3>
                <p className="text-gray-700">Email: {application.email}</p>
                <p className="text-gray-700">Cover Letter: {application.coverLetter}</p>
                <p className="text-gray-700">Question: {application.question}</p>
                <p className="text-gray-700">Resume: {application.resume}</p>  {/* Display the resume name or link */}
                <div className="mt-2">
                  <button
                    onClick={() => router.push(`/application-details/${application.id}`)}  // Link to application details page
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No applications yet for this job.</p>
        )}
      </div>
    </div>
  );
};

export default JobApplicationsPage;