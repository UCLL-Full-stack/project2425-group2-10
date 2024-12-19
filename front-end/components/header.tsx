// front-end/components/Header.tsx

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon, MenuIcon, XIcon, HomeIcon, ClipboardListIcon, PlusCircleIcon, LoginIcon, UserAddIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import LanguageDropdown from './LanguageDropdown'; // Import the LanguageDropdown component

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'My Applications', href: '/my-applications', icon: ClipboardListIcon },
  { name: 'Add Job', href: '/add-job', icon: PlusCircleIcon },
];

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow">
      <div className="container mx-auto px-4 py-5 flex justify-between items-center">
        {/* Logo and Site Name */}
        <Link href="/" className="flex items-center space-x-2">
          {/* Logo SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zm0 0c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zm0 0c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2z" />
          </svg>
          <span className="text-2xl font-bold">ApplyWise</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-5 items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 text-base font-medium ${
                router.pathname === item.href
                  ? 'border-b-2 border-white'
                  : 'hover:text-gray-200 transition-colors'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}

          {/* Authentication Links */}
          <div className="flex space-x-4">
            <Link href="/login" className="flex items-center space-x-2 hover:text-gray-200 transition-colors">
              <LoginIcon className="h-5 w-5" />
              <span>Login</span>
            </Link>
            <Link href="/register" className="flex items-center space-x-2 hover:text-gray-200 transition-colors">
              <UserAddIcon className="h-5 w-5" />
              <span>Register</span>
            </Link>

            {/* Language Dropdown Positioned After Register */}
            <LanguageDropdown />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  router.pathname === item.href
                    ? 'bg-blue-800 text-white'
                    : 'text-white hover:bg-blue-600 hover:text-gray-200 transition-colors'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Authentication Links */}
            <Link
              href="/login"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-600 hover:text-gray-200 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LoginIcon className="h-5 w-5" />
              <span>Login</span>
            </Link>
            <Link
              href="/register"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-600 hover:text-gray-200 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UserAddIcon className="h-5 w-5" />
              <span>Register</span>
            </Link>

            {/* Language Dropdown Positioned After Register in Mobile Menu */}
            <div className="px-3 py-2">
              <LanguageDropdown />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;