import React, { useState } from "react";
import { useRouter } from "next/router";  // For navigation
import ApplicationService from "@services/ApplicationService";  // Import the application service
import Navbar from "@components/Navbar";  // Import the Navbar component
import Home from "@components/Home";

const ApplyJobPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;  // Get the job ID from the URL parameters
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState<File | null>(null); // Handle resume as a file
  const [coverLetter, setCoverLetter] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Error state to handle any issues during submission

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if id is valid before proceeding
    if (!id) {
      alert("Job ID is invalid.");
      return;
    }

    // Check if a resume file is selected
    if (!resume) {
      alert("Please upload your resume.");
      return;
    }

    // Prepare FormData to send both text and file data
    const applicationData = new FormData();
    applicationData.append("fullName", fullName);
    applicationData.append("email", email);
    applicationData.append("coverLetter", coverLetter);
    applicationData.append("question", question);

    // Append the resume file to FormData directly
    applicationData.append("file", resume);  // The key name 'file' for the file upload

    setLoading(true);
    setError("");  // Clear previous errors

    try {
      // Send the FormData to the backend API
      const response = await ApplicationService.applyForJob(id as string, applicationData);

      // Check the response (optional, depending on backend structure)
      if (response && response.status === "success") {
        alert("Your application has been submitted!");
        router.push("/jobs");  // Redirect to the jobs page after successful application
      } else {
        throw new Error("Failed to apply for the job. Please try again.");
      }
    } catch (error: any) {
      // Handle error if the request fails
      setError(error.message || "Failed to apply for the job.");
      console.error("Error applying for the job:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />  {/* Include Navbar at the top of the page */}
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Apply for the Job</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>} {/* Display error message */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="resume" className="block text-gray-700">Resume</label>
            <input
              type="file"
              id="resume"
              onChange={(e) => setResume(e.target.files ? e.target.files[0] : null)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="coverLetter" className="block text-gray-700">Cover Letter</label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
              rows={4}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="question" className="block text-gray-700">Why do you want to work here?</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
              rows={4}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Applying..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
      <Home />
    </div>
  );
};

export default ApplyJobPage;