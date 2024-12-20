// services/ApplicationService.ts

// Apply for a job
export const applyForJob = async (jobId: string, data: any) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;  // Get API URL from environment variables
    const response = await fetch(`${API_URL}/applications/${jobId}`, {
      method: 'POST',  // HTTP method (POST)
      headers: {
        'Content-Type': 'application/json',  // Set Content-Type to JSON
      },
      body: JSON.stringify(data),  // Convert data to JSON
    });

    // Check if the response is okay (status code 200-299)
    if (!response.ok) {
      throw new Error(`Error applying for job: ${response.statusText}`);
    }

    const result = await response.json();  // Parse the response body as JSON
    return result;
  } catch (error: any) {
    console.error("Error applying for job:", error.message);
    throw error;  // Rethrow the error to be handled by the calling function
  }
};

// Get applications by user ID
export const getApplicationsByUserId = async (userId: string) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;  // Get API URL from environment variables
    const response = await fetch(`${API_URL}/applications/my-applications?userId=${userId}`, {
      method: 'GET',  // HTTP method (GET)
      headers: {
        'Content-Type': 'application/json',  // Set Content-Type to JSON
      },
    });

    // Check if the response is okay (status code 200-299)
    if (!response.ok) {
      throw new Error(`Error fetching applications by user ID: ${response.statusText}`);
    }

    const data = await response.json();  // Parse the response body as JSON
    return data;
  } catch (error: any) {
    console.error("Error fetching applications by user ID:", error.message);
    throw error;  // Rethrow the error to be handled by the calling function
  }
};

// Get applications by job ID (for recruiter/admin)
export const getApplicationsByJobId = async (jobId: string) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;  // Get API URL from environment variables
    const response = await fetch(`${API_URL}/applications/${jobId}`, {
      method: 'GET',  // HTTP method (GET)
      headers: {
        'Content-Type': 'application/json',  // Set Content-Type to JSON
      },
    });

    // Check if the response is okay (status code 200-299)
    if (!response.ok) {
      throw new Error(`Error fetching applications by job ID: ${response.statusText}`);
    }

    const data = await response.json();  // Parse the response body as JSON
    return data;
  } catch (error: any) {
    console.error("Error fetching applications by job ID:", error.message);
    throw error;  // Rethrow the error to be handled by the calling function
  }
};

const ApplicationService = {
  applyForJob,
  getApplicationsByUserId,
  getApplicationsByJobId
}

export default ApplicationService;