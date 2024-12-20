import React, { useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from Next.js
import AuthService from "@services/AuthService"; 
import Home from "@components/Home";// Import your authentication service

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();  // Use useRouter for navigation in Next.js

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Prepare login data
    const data = { email, password };

    try {
      const response = await AuthService.loginUser(data);  // Call loginUser service function
      localStorage.setItem("token", response.token); // Store the JWT token in local storage
      router.push("/jobs"); // Use Next.js's router.push() to navigate to the jobs page
    } catch (error) {
      setError("Invalid email or password.");  // Set error message if login fails
    } finally {
      setLoading(false);  // Reset loading state after request is complete
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Login</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-md"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;