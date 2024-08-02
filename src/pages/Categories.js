import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    axios
      .get('http://localhost:4000/admin/fetchCategory')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error(
          'There was an error fetching the categories data!',
          error
        );
      });
  }, []);

  const handleDeleteCategory = async (id) => {
    try {
      await axios.put(`http://localhost:4000/admin/deleteCategory/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
      toast.success('Category deleted successfully!');
    } catch (error) {
      console.error('There was an error deleting the category!', error);
      toast.error('Failed to delete category!');
    }
  };

  // Calculate current categories to display
  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div className='p-4'>
      <ToastContainer />
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold mb-4'>Categories</h1>
        <Link to='/add-category'>
          <button className='bg-gray-500 text-white px-4 py-2'>
            Add Category
          </button>
        </Link>
      </div>

      <table className='min-w-full bg-white border border-gray-500'>
        <thead>
          <tr>
            <th className='py-2 px-4 border-b text-left'>Name</th>
            <th className='py-2 px-4 border-b text-left'>Description</th>
            <th className='py-2 px-4 border-b text-left'>Image</th>
            <th className='py-2 px-4 border-b text-left'>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map((category) => (
            <tr key={category._id}>
              <td className='py-2 px-4 border-b'>{category.name}</td>
              <td className='py-2 px-4 border-b'>{category.description}</td>
              <td className='py-2 px-4 border-b'>
                {category.categoryImage.length > 0 && (
                  <img
                    src={category.categoryImage[0]}
                    alt={category.name}
                    className='w-16 h-16 object-cover'
                  />
                )}
              </td>
              <td className='py-2 px-4 border-b'>
                <Link to={`/edit-category?name=${category.name}`}>
                  <button className='bg-green-500 text-white px-4 py-2 rounded mr-5'>
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className='bg-red-500 text-white px-4 py-2 rounded'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className='mt-4'>
        <nav className='flex justify-center'>
          <ul className='flex space-x-2'>
            {[...Array(totalPages).keys()].map((pageNumber) => (
              <li key={pageNumber + 1}>
                <button
                  onClick={() => handlePageChange(pageNumber + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === pageNumber + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {pageNumber + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Categories;
