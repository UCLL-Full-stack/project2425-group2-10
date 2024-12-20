// components/Navbar.tsx
import React from "react";
import Link from "next/link"; // Import Link from Next.js for navigation

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-white font-bold text-lg cursor-pointer">ApplyWise</span>
        </Link>
        <div className="space-x-4">
          <Link href="/job-list">
            <span className="text-white hover:text-gray-200 cursor-pointer">Job List</span>
          </Link>
          <Link href="/job-detail">
            <span className="text-white hover:text-gray-200 cursor-pointer">Job Detail</span>
          </Link>
          <Link href="/login">
            <span className="text-white hover:text-gray-200 cursor-pointer">Login</span>
          </Link>
          <Link href="/register">
            <span className="text-white hover:text-gray-200 cursor-pointer">Register</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;