import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddSubCategory() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subcategoryImage, setSubCategoryImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    //fetch all categories
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategoryObj = categories.find(
      (category) => category._id === selectedCategory
    );
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append(
      'CategoryName',
      selectedCategoryObj ? selectedCategoryObj.name : ''
    );
    if (subcategoryImage) {
      formData.append('subcategoryImage', subcategoryImage);
    }

    try {
      await axios.post(
        'http://localhost:4000/admin/addOrEditSubcategory',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      navigate('/subcategories');
    } catch (error) {
      console.error('There was an error adding the category!', error);
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Add New Sub Category</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
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
        <div>
          <label className='block mb-1'>Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border p-3 w-full'
            required
          />
        </div>
        <div>
          <label className='block mb-1'>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='border p-2 w-full'
            required
          />
        </div>
        <div>
          <label className='block mb-1'> Sub Category Image</label>
          <input
            type='file'
            onChange={(e) => setSubCategoryImage(e.target.files[0])}
            className='border p-2 w-full'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 tex-white px-4 py-2 rounded'
        >
          Add Category
        </button>
      </form>
    </div>
  );
}
export default AddSubCategory;
