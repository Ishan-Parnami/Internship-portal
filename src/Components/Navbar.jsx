import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 p-4 shadow-md navbar">
      <ul className="flex justify-center gap-10 space-x-4">
        <li>
          <Link to="/" className="text-white text-lg font-semibold hover:text-teal-300 transition duration-300">Job Opportunities</Link>
        </li>
        <li>
          <Link to="/dashboard" className="text-white text-lg font-semibold hover:text-teal-300 transition duration-300">Dashboard</Link>
        </li>
        <li>
          <Link to="/login" className="text-white text-lg font-semibold hover:text-teal-300 transition duration-300">Login</Link>
        </li>
      </ul>
    </nav>
  );
}
