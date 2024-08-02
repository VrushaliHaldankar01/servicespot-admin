import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SubCategories() {
  const [subcategories, setSubCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = () => {
    axios
      .get('http://localhost:4000/admin/fetchSubCategory')
      .then((response) => {
        setSubCategories(response.data);
      })
      .catch((error) => {
        console.error(
          'There was an error fetching the subcategories data!',
          error
        );
      });
  };

  const handleDeleteSubCategory = async (id) => {
    try {
      await axios.put(`http://localhost:4000/admin/deleteSubCategory/${id}`);
      setSubCategories(
        subcategories.filter((subcategory) => subcategory._id !== id)
      );
      toast.success('Subcategory deleted successfully!');
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error('Error deleting subcategory!');
    }
  };

  // Calculate current subcategories to display
  const indexOfLastSubCategory = currentPage * itemsPerPage;
  const indexOfFirstSubCategory = indexOfLastSubCategory - itemsPerPage;
  const currentSubCategories = subcategories.slice(
    indexOfFirstSubCategory,
    indexOfLastSubCategory
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(subcategories.length / itemsPerPage);

  return (
    <div className='p-4'>
      <ToastContainer />
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold mb-4'>SubCategories</h1>
        <Link to='/add-sub-category'>
          <button className='bg-gray-500 text-white px-4 py-2'>
            Add Sub Category
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
          {currentSubCategories.map((subcategory) => (
            <tr key={subcategory._id}>
              <td className='py-2 px-4 border-b'>{subcategory.name}</td>
              <td className='py-2 px-4 border-b'>{subcategory.description}</td>
              <td className='py-2 px-4 border-b'>
                {subcategory.subcategoryImage.length > 0 && (
                  <img
                    src={subcategory.subcategoryImage[0]}
                    alt={subcategory.name}
                    className='w-16 h-16 object-cover'
                  />
                )}
              </td>
              <td className='py-2 px-4 border-b'>
                <Link to={`/edit-sub-category?name=${subcategory.name}`}>
                  <button className='bg-green-500 text-white px-4 py-2 rounded mr-5'>
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteSubCategory(subcategory._id)}
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

export default SubCategories;
