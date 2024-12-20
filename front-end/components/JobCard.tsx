import React from "react";
import Link from "next/link"; // Import Link from Next.js for client-side navigation
import { Job } from "../types";  // Ensure that Job type is defined in front-end/types

interface JobCardProps {
  job: Job;  // Define the prop type as Job
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
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
        {/* Use Link component for client-side navigation */}
        <Link href={`/jobs/${job.id}`}>
          <button className="text-blue-500 hover:text-blue-700 font-semibold">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;