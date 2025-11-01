import { Link } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 transition hover:text-blue-700">
              Rich English
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <nav className="hidden md:flex items-center  gap-8 sm:gap-4  ">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</Link>
            <Link to="/apply" className="text-gray-700 hover:text-blue-600 transition-colors">Apply</Link>
            <Link to="/faq" className="text-gray-700 hover:text-blue-600 transition-colors">FAQ</Link>
            <Link to="/leaderboard" className="text-gray-700 hover:text-blue-600 transition-colors">Leaderboard</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Teacher Login
            </Link>
          </nav>
        </div>

        {/* Mobile navigation */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 pb-2 text-base font-semibold text-blue-600">
              Rich English
            </Link>
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">About</Link>
            <Link to="/apply" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Apply</Link>
            <Link to="/faq" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">FAQ</Link>
            <Link to="/leaderboard" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Leaderboard</Link>
            <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
            <Link to="/login" className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Teacher Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;