import React, { useState } from "react";
import { useRouter } from "next/router";  // For navigation
import JobService from "@services/JobService";  // Import JobService for creating jobs
import Navbar from "@components/Navbar";  // Import Navbar component

const CreateJobPage: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [status, setStatus] = useState("Open");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const jobData = {
      title,
      companyName,
      description,
      skills,
      experience,
      status,
    };

    try {
      await JobService.createJob(jobData);  // Use JobService to create the job
      alert("Job created successfully!");
      router.push("/jobs");  // Redirect to job listing page after successful creation
    } catch (error) {
      alert("Failed to create job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />  {/* Include Navbar at the top of the page */}
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Create a New Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700">Job Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-gray-700">Company Name</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
              rows={4}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="skills" className="block text-gray-700">Skills Required</label>
            <input
              type="text"
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="experience" className="block text-gray-700">Experience Level</label>
            <input
              type="text"
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700">Job Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJobPage;