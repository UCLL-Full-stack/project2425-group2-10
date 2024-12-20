import React from "react";
import Link from "next/link"; // Import Link from Next.js for navigation
import { useRouter } from "next/router";  // For navigation

const Navbar: React.FC = () => {
  const router = useRouter();

  // Handle the logout functionality
  const handleLogout = () => {
    // Clear the JWT token from local storage
    localStorage.removeItem("token");

    // Redirect the user to the login page
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-white font-bold text-lg cursor-pointer">ApplyWise</span>
        </Link>
        <div className="space-x-4">
          <Link href="/jobs">
            <span className="text-white hover:text-gray-200 cursor-pointer">Jobs</span>
          </Link>
          <Link href="/create-job">
            <span className="text-white hover:text-gray-200 cursor-pointer">Add Job</span>
          </Link>
          <Link href="/job-detail">
            <span className="text-white hover:text-gray-200 cursor-pointer">Details</span>
          </Link>
          <Link href="/applications">
            <span className="text-white hover:text-gray-200 cursor-pointer">Applications</span>
          </Link>

          {/* Show Logout button if user is logged in */}
          {localStorage.getItem("token") ? (
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-200 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <>
              {/* Show Login and Register links if user is not logged in */}
              <Link href="/login">
                <span className="text-white hover:text-gray-200 cursor-pointer">Login</span>
              </Link>
              <Link href="/register">
                <span className="text-white hover:text-gray-200 cursor-pointer">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;