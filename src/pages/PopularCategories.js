import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PopularCategories() {
  const [categories, setCategories] = useState([]);
  const [popularcategories, setPopularCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Fetch popular categories
    axios
      .get('http://localhost:4000/admin/fetchPopularCategory')
      .then((response) => {
        setPopularCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching popular categories:', error);
      });

    // Fetch all categories
    axios
      .get('http://localhost:4000/admin/fetchCategory')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleAddCategory = async () => {
    const selectedCategoryObj = categories.find(
      (category) => category._id === selectedCategory
    );
    const categoryName = selectedCategoryObj ? selectedCategoryObj.name : '';

    if (!categoryName) {
      console.error('Category name is required!');
      return;
    }

    try {
      await axios.post('http://localhost:4000/admin/addPopularCategory', {
        name: categoryName,
      });

      // Refresh popular categories after adding
      const response = await axios.get(
        'http://localhost:4000/admin/fetchPopularCategory'
      );
      setPopularCategories(response.data);
      setShowForm(false);
      toast.success('Popular category added successfully!');
    } catch (error) {
      console.error('Error adding popular category:', error);
      toast.error('Error adding popular category!');
    }
  };

  const handleDeleteCategory = async (id) => {
    console.log('Deleting category with ID:', id);
    try {
      await axios.put(
        `http://localhost:4000/admin/deletePopularCategory/${id}`
      );

      // Refresh popular categories after deletion
      const response = await axios.get(
        'http://localhost:4000/admin/fetchPopularCategory'
      );
      setPopularCategories(response.data);
      toast.success('Popular category deleted successfully!');
    } catch (error) {
      console.error('Error deleting popular category:', error);
      toast.error('Error deleting popular category!');
    }
  };

  return (
    <div className='p-4'>
      <ToastContainer />
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold mb-4'>Popular Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className='bg-gray-500 text-white px-4 py-2 '
        >
          {showForm ? 'Cancel' : 'Add Popular Category'}
        </button>
      </div>

      {showForm && (
        <div className='mb-4'>
          <h2 className='text-xl font-bold mb-2'>Add Popular Category</h2>
          <div className='mb-4'>
            <label className='block mb-1'>Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='border p-2 w-full'
            >
              <option value=''>Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAddCategory}
            className='bg-blue-500 text-white px-4 py-3 rounded'
          >
            Add Popular Category
          </button>
        </div>
      )}

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
          {popularcategories.map(({ popularCategoryId, category }) => (
            <tr key={popularCategoryId}>
              <td className='py-2 px-4 border-b'>{category.name}</td>
              <td className='py-2 px-4 border-b'>{category.description}</td>
              <td className='py-2 px-4 border-b'>
                {category.categoryImage && category.categoryImage.length > 0 ? (
                  <img
                    src={category.categoryImage[0]}
                    alt={category.name}
                    className='w-16 h-26 object-cover'
                  />
                ) : (
                  'No Image'
                )}
              </td>
              <td className='py-2 px-4 border-b'>
                <button
                  onClick={() => handleDeleteCategory(popularCategoryId)}
                  className='bg-red-500 text-white px-4 py-2 rounded'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PopularCategories;
