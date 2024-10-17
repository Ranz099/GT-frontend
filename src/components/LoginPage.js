import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://gt-backend-pfho.onrender.com/api/auth/login', formData);
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token); // Store the token in local storage
      navigate('/'); // Redirect to the home page after successful login
      window.location.reload();
    } catch (err) {
      setError(err.response.data.message || 'Login failed');
      console.error('Error during login:', err);
    }
  };

  return (
    <div className="container mx-auto px-20 py-8">
      <h2 className="mt-10 text-2xl font-bold mb-8 text-blue-200 border-b-2 border-blue-500 pb-2 tracking-wide">LOGIN</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-blue-500 hover:shadow-xl">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
