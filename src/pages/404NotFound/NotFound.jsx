import React, { useState } from 'react';

const NotFound = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Redirect to search page - replace with your actual search route
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex justify-center items-center px-4 py-8 font-sans">
      <div className="text-center max-w-md w-[100%] space-y-6">
        {/* Illustration - Replace with your custom image or icon component */}
        <div className="w-48 h-48 mx-auto bg-white rounded-full flex items-center justify-center text-6xl shadow-lg">
          🛒
        </div>
        
        <div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Oops! 404</h1>
          <p className="text-xl text-gray-600">
            The page you're looking for has checked out early. Let's find something amazing instead.
          </p>
        </div>
        
        {/* Search Bar */}
        {/* <form onSubmit={handleSearch} className="relative mx-auto max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            placeholder="Search for products..."
            className="w-[100%] px-4 py-3 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-lg pl-10 pr-10 shadow-md"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Go
          </button>
        </form>
         */}
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors shadow-md"
          >
            Go Home
          </a>
          <a
            href="/products"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition-colors shadow-md"
          >
            Browse Products
          </a>
        </div>
        
        {/* Support Link */}
        <p className="text-sm text-gray-500">
          Need help? <a href="/support" className="text-blue-500 hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;