// services/JobService.ts

import { Job } from "@types";

// Utility function to get the JWT token
const getToken = () => {
  return localStorage.getItem("token"); // Retrieve token from localStorage
};

// Get all jobs
export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;  // Get the API URL from environment variables
    const token = getToken();  // Get the JWT token from localStorage

    const response = await fetch(`${API_URL}/jobs`, {
      method: 'GET',  // HTTP method (GET)
      headers: {
        'Content-Type': 'application/json',  // Set Content-Type to JSON
        Authorization: token ? `Bearer ${token}` : "",  // Include Authorization header if token exists
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data: Job[] = await response.json();  // Parse the response body as JSON and type it as Job[]
    return data;  // Return the fetched data
  } catch (error: any) {
    console.error("Error fetching jobs:", error.message);
    throw error;  // Rethrow the error to be handled in the component
  }
};

// Get job by ID
export const fetchJobById = async (jobId: string): Promise<Job> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;  // Use the environment variable for the API base URL
    const token = getToken();  // Get the JWT token from localStorage

    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: 'GET',  // HTTP method (GET)
      headers: {
        'Content-Type': 'application/json',  // Specify the content type as JSON
        Authorization: token ? `Bearer ${token}` : "",  // Include Authorization header if token exists
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching job by ID: ${response.statusText}`);
    }

    const data = await response.json();  // Parse the response body as JSON
    return data;  // Return the job data
  } catch (error: any) {
    console.error("Error fetching job by ID:", error.message);
    throw error;  // Rethrow the error for further handling
  }
};

// Create a new job (for recruiters and admins)
export const createJob = async (data: any) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;  // Use the environment variable for the API base URL
    const token = getToken();  // Get the JWT token from localStorage

    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',  // HTTP method (POST)
      headers: {
        'Content-Type': 'application/json',  // Specify the content type as JSON
        Authorization: token ? `Bearer ${token}` : "",  // Include Authorization header if token exists
      },
      body: JSON.stringify(data),  // Stringify the data to send as the request body
    });

    if (!response.ok) {
      throw new Error(`Error creating job: ${response.statusText}`);
    }

    const result = await response.json();  // Parse the response body as JSON
    return result;
  } catch (error: any) {
    console.error("Error creating job:", error.message);
    throw error;  // Rethrow the error for further handling
  }
};

// Update a job (for recruiters and admins)
export const updateJob = async (jobId: string, data: any) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;  // Use the environment variable for the API base URL
    const token = getToken();  // Get the JWT token from localStorage

    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: 'PUT',  // HTTP method (PUT)
      headers: {
        'Content-Type': 'application/json',  // Specify the content type as JSON
        Authorization: token ? `Bearer ${token}` : "",  // Include Authorization header if token exists
      },
      body: JSON.stringify(data),  // Stringify the data to send as the request body
    });

    if (!response.ok) {
      throw new Error(`Error updating job: ${response.statusText}`);
    }

    const result = await response.json();  // Parse the response body as JSON
    return result;
  } catch (error: any) {
    console.error("Error updating job:", error.message);
    throw error;  // Rethrow the error for further handling
  }
};

// Delete a job (for recruiters and admins)
export const deleteJob = async (jobId: string) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;  // Use the environment variable for the API base URL
    const token = getToken();  // Get the JWT token from localStorage

    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: 'DELETE',  // HTTP method (DELETE)
      headers: {
        'Content-Type': 'application/json',  // Specify the content type as JSON
        Authorization: token ? `Bearer ${token}` : "",  // Include Authorization header if token exists
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting job: ${response.statusText}`);
    }

    const result = await response.json();  // Parse the response body as JSON
    return result;
  } catch (error: any) {
    console.error("Error deleting job:", error.message);
    throw error;  // Rethrow the error for further handling
  }
};

// Export all job-related functions as part of JobService
const JobService = {
  fetchJobs,
  fetchJobById,
  createJob,
  updateJob,
  deleteJob,
};

export default JobService;