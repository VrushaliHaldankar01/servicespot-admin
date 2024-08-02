import React, { useState } from 'react';
//import './UserRegisterModule.css'; // Keep this if you have custom styles
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios'; // Import Axios
import { Navigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await axios.post('http://localhost:4000/user/login', {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem('token', response.data.token);
        setError('');
        setIsLoggedIn(true);
      } catch (error) {
        setError(
          error.response?.data?.error ||
            'An unexpected error occurred. Please try again.'
        );
      }
    }
  };

  if (isLoggedIn) {
    return <Navigate to='/Categories' replace />;
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='container mx-auto mt-4 mb-4 flex-grow max-w-md'>
        <div className='p-6 bg-white rounded-lg shadow-md'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <h3 className='text-2xl font-bold mb-4'>Login</h3>
            <div className='form-group'>
              <label className='block text-gray-700 mb-1'>Email</label>
              <input
                type='email'
                className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                name='email'
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className='text-red-500 mt-1'>{errors.email}</p>
              )}
            </div>
            <div className='form-group'>
              <label className='block text-gray-700 mb-1'>Password</label>
              <input
                type='password'
                className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                name='password'
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className='text-red-500 mt-1'>{errors.password}</p>
              )}
            </div>
            <div className='text-center'>
              <button
                type='submit'
                className='bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition'
              >
                Login
              </button>
            </div>
            {error && (
              <div className='text-red-500 text-center mt-3'>{error}</div>
            )}
            <div className='text-center mt-3'>
              <p>
                Don't have an account?{' '}
                <a
                  href='/UserRegister'
                  className='text-blue-500 hover:underline'
                >
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
