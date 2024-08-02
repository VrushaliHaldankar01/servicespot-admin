import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className='lg:hidden p-2 text-white bg-gray-800 hover:bg-gray-700 fixed top-16 left-4 z-50'
      >
        {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-4 transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:w-64 lg:mt-0`}
      >
        {/* <h2 className='text-2xl font-bold mb-6'>Admin-panel</h2> */}
        <ul>
          <li className='text-xl mb-4 p-4 mt-10'>
            <Link to='/vendordetails' className='hover:text-blue-300'>
              Vendor Details
            </Link>
          </li>
          <li className='text-xl mb-4 p-4'>
            <Link to='/categories' className='hover:text-blue-300'>
              Categories
            </Link>
          </li>
          <li className='text-xl mb-4 p-4'>
            <Link to='/subcategories' className='hover:text-blue-300'>
              SubCategories
            </Link>
          </li>
          <li className='text-xl mb-4 p-4'>
            <Link to='/popularcategories' className='hover:text-blue-300'>
              Popular Categories
            </Link>
          </li>
          <li className='text-xl mb-4 p-4'>
            <Link to='/trendingcategories' className='hover:text-blue-300'>
              Trending Categories
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
