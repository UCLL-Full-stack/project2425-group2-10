import React from "react";
import Link from "next/link";  // Import Link from Next.js to navigate between pages

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to ApplyWise</h1>
      <p className="text-xl text-gray-700 mb-4">A platform to manage job applications.</p>
      <div className="flex space-x-4">
        <Link href="/login">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;