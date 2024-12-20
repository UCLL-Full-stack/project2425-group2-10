// services/AuthService.ts

// Register a new user
export const registerUser = async (data: { email: string; password: string; role: string }) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;  // Get the API URL from environment variables

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',  // HTTP method (POST)
      headers: {
        'Content-Type': 'application/json',  // Set Content-Type to JSON
      },
      body: JSON.stringify(data),  // Stringify the data to send as the request body
    });

    // Check if the response is okay (status code 200-299)
    if (!response.ok) {
      const errorData = await response.json(); // Attempt to parse the error response
      console.error("Registration failed:", errorData);  // Log the error response from backend
      throw new Error(`Error registering user: ${response.statusText} - ${errorData.message || "No additional details"}`);
    }

    const result = await response.json();  // Parse the response body as JSON
    return result;
  } catch (error: any) {
    console.error("Error registering user:", error.message);  // Log the error for debugging
    throw error;  // Rethrow the error to be handled by the calling function
  }
};

// Login user
export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;  // Get the API URL from environment variables

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',  // HTTP method (POST)
      headers: {
        'Content-Type': 'application/json',  // Set Content-Type to JSON
      },
      body: JSON.stringify(data),  // Stringify the login data to send as the request body
    });

    // Check if the response is okay (status code 200-299)
    if (!response.ok) {
      const errorData = await response.json();  // Attempt to parse the error response
      console.error("Login failed:", errorData);  // Log the error response from backend
      throw new Error(`Error logging in: ${response.statusText} - ${errorData.message || "No additional details"}`);
    }

    const result = await response.json();  // Parse the response body as JSON
    return result;
  } catch (error: any) {
    console.error("Error logging in:", error.message);  // Log the error for debugging
    throw error;  // Rethrow the error to be handled by the calling function
  }
};

const AuthService = {
  registerUser,
  loginUser
}

export default AuthService;