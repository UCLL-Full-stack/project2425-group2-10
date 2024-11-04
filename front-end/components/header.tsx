// front-end/components/header.tsx

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout, role } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">ApplyWise</Link>
        </h1>
        <div>
          {!isAuthenticated ? (
            <>
              <Link href="/login" className="mr-4 hover:underline">
                Login
              </Link>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Only show "Add Job" if the user is an admin */}
              {role === 'admin' && (
                <Link href="/add-job" className="mr-4 hover:underline">
                  Add Job
                </Link>
              )}
              <button onClick={logout} className="hover:underline">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

