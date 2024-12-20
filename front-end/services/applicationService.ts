// services/ApplicationService.ts
export const applyForJob = async (jobId: string, data: any) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;  // Get the API URL from environment variables
    const token = localStorage.getItem("token");  // Get the token from localStorage

    if (!API_URL) {
      throw new Error("API URL is not defined");
    }

    if (!token) {
      throw new Error("User is not authenticated");
    }

    // Log the request for debugging purposes
    console.log("Sending request to:", `${API_URL}/applications/${jobId}`);
    console.log("Request Headers:", {
      'Authorization': `Bearer ${token}`,
    });
    console.log("Request Body:", data);

    const response = await fetch(`${API_URL}/applications/${jobId}`, {
      method: 'POST',  // HTTP method (POST)
      headers: {
        'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
      },
      body: data,  // Send FormData directly
    });

    // Check if the response is successful (status 200-299)
    if (!response.ok) {
      let errorMessage = `Error applying for job: ${response.status} - ${response.statusText}`;

      // Try to parse error message from the response if present
      try {
        const errorData = await response.json();
        errorMessage = `Error applying for job: ${response.status} - ${errorData.message || errorData.error || 'No additional details'}`;
      } catch (error) {
        console.error("Error applying for job: Failed to parse error response", error);
      }

      throw new Error(errorMessage);  // Throw a more descriptive error
    }

    const result = await response.json();  // Parse the response body as JSON
    console.log("Job application successful:", result);
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
    const token = localStorage.getItem("token");  // Get the token from localStorage or any other storage

    const response = await fetch(`${API_URL}/applications/my-applications?userId=${userId}`, {
      method: 'GET',  // HTTP method (GET)
      headers: {
        'Content-Type': 'application/json',  // Set Content-Type to JSON
        'Authorization': `Bearer ${token}`  // Include the token in the Authorization header
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
    const token = localStorage.getItem("token");  // Get the token from localStorage or any other storage

    const response = await fetch(`${API_URL}/applications/${jobId}`, {
      method: 'GET',  // HTTP method (GET)
      headers: {
        'Content-Type': 'application/json',  // Set Content-Type to JSON
        'Authorization': `Bearer ${token}`  // Include the token in the Authorization header
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