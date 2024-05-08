import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
        <div className="text-lg text-primary-text font-bold">My App</div>
        <div>
          <Link to="/" className="text-primary hover:text-primary-text px-4 py-2 rounded transition duration-200">Home</Link>
          <Link to="/login" className="text-primary hover:text-primary-text px-4 py-2 rounded transition duration-200">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
