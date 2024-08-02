import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddCategory() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (categoryImage) {
      formData.append('categoryImage', categoryImage);
    }

    try {
      await axios.post(
        'http://localhost:4000/admin/addOrEditCategory',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      navigate('/categories');
    } catch (error) {
      console.error('There was an error adding the category!', error);
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Add New Category</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
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
          <label className='block mb-1'>Category Image</label>
          <input
            type='file'
            onChange={(e) => setCategoryImage(e.target.files[0])}
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
export default AddCategory;
