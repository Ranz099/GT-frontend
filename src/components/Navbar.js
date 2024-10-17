import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => {
    setIsMobile(!isMobile);
  };

  // Check if the user is logged in by checking for a token in local storage
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <nav className="bg-green-100 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 text-4xl font-extrabold tracking-wider uppercase drop-shadow-2xl">GAMELIO</div>
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="text-black hover:underline"></Link>
          {isLoggedIn ? (
            // Optionally add a Logout link here if needed
            <button className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-semibold px-6 py-3 rounded-full border-2 border-blue-500 bg-white hover:bg-gradient-to-r hover:from-pink-900 hover:to-pink-900 hover:text-pink hover:border-transparent transition-all duration-300 ease-in-out shadow-lg transform hover:-translate-y-1 hover:shadow-xl ml-4" onClick={() => {
              localStorage.removeItem('token'); // Clear the token on logout
              window.location.reload(); // Reload the page to reflect changes
            }}>
              LOGOUT
            </button>
          ) : (
            <>
              <Link to="/login" className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-semibold px-6 py-3 rounded-full border-2 border-blue-500 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-black hover:border-transparent transition-all duration-300 ease-in-out shadow-lg transform hover:-translate-y-1 hover:shadow-xl">Login</Link>
              <Link to="/register" className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-semibold px-6 py-3 rounded-full border-2 border-blue-500 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-black hover:border-transparent transition-all duration-300 ease-in-out shadow-lg transform hover:-translate-y-1 hover:shadow-xl ml-4">Register</Link>
            </>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
      <div className={`md:hidden ${isMobile ? 'block' : 'hidden'} bg-blue`}>
        <Link to="/" className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-semibold px-6 py-3 rounded-full border-2 border-blue-500 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-black hover:border-transparent transition-all duration-300 ease-in-out shadow-lg transform hover:-translate-y-1 hover:shadow-xl ml-4">Home</Link>
        {isLoggedIn ? (
          <button className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-semibold px-6 py-3 rounded-full border-2 border-blue-500 bg-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-pink-600 hover:text-pink hover:border-transparent transition-all duration-300 ease-in-out shadow-lg transform hover:-translate-y-1 hover:shadow-xl ml-4" onClick={() => {
            localStorage.removeItem('token'); // Clear the token on logout
            window.location.reload(); // Reload the page to reflect changes
          }}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="block text-white hover:underline p-2">Login</Link>
            <Link to="/register" className="block text-white hover:underline p-2">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
