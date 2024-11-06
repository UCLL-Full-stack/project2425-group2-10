// front-end/components/header.tsx

import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <div>
          <Link href="/" className="text-2xl font-bold hover:text-gray-200">
            ApplyWise
          </Link>
        </div>
        <div className="flex space-x-8">
          <Link href="/" className="hover:text-gray-200">
            Home
          </Link>
          <Link href="/my-applications" className="hover:text-gray-200">
            My Applications
          </Link>
          <Link href="/add-job" className="hover:text-gray-200">
            Add Job
          </Link>
          <Link href="/login" className="hover:text-gray-200">
            Login
          </Link>
          <Link href="/register" className="hover:text-gray-200">
            Register
          </Link>
          {/* Future navigation links */}
        </div>
      </nav>
    </header>
  );
};

export default Header;
