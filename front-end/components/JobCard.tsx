import React from "react";
import { Job } from "../types";  // Ensure that Job type is defined in front-end/types
<<<<<<< HEAD
import { useRouter } from "next/router"; // Import Next.js useRouter for navigation

=======
>>>>>>> ca06a2b7736a0ee727669a2811bdc9a4160f6a2f
interface JobCardProps {
  job: Job;  // Define the prop type as Job
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const router = useRouter();

  // Handle Apply button click
  const handleApplyClick = () => {
    // Navigate to the Apply Job Page using the job ID
    router.push(`/apply/${job.id}`);
  };

  return (
    <div className="border rounded-md p-4 shadow-md hover:shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
      <p className="text-gray-600">{job.companyName}</p>
      <p className="text-gray-500">{job.experience}</p>
      <p className="text-gray-700">{job.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span
          className={`text-sm px-3 py-1 rounded-full ${
            job.status === "Open" ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-600"
          }`}
        >
          {job.status}
        </span>
        {/* Apply Now button */}
        <button
          onClick={handleApplyClick}
          className="text-blue-500 hover:text-blue-700 font-semibold"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;