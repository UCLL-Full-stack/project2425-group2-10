// components/header.tsx

import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 flex justify-between items-center py-4">
        <div>
          <Link href="/" className="text-2xl font-bold text-blue-600">
            ApplyWise
          </Link>
        </div>
        <div className="space-x-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          {/* Additional navigation links */}
          <Link href="/about" className="text-gray-600 hover:text-blue-600">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
