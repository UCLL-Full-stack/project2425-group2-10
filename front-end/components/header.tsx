// front-end/components/header.tsx

import React, { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className="bg-blue-600 text-white shadow">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <div>
          <Link href="/" className="text-2xl font-bold hover:text-gray-200">
            ApplyWise
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-gray-200">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/add-job" className="hover:text-gray-200">
                Add Job
              </Link>
              <button
                onClick={logout}
                className="hover:text-gray-200 focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-gray-200">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
