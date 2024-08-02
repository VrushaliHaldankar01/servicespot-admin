import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function EditCategory() {
  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const categoryName = query.get('name');

  useEffect(() => {
    if (categoryName) {
      axios
        .get(`http://localhost:4000/admin/fetchCategory?name=${categoryName}`)
        .then((response) => {
          if (response.data) {
            const category = response.data[0];
            setId(category._id);
            setName(category.name);
            setDescription(category.description);
            if (category.categoryImage && category.categoryImage.length > 0) {
              setExistingImage(category.categoryImage[0]);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching category data!', error);
        });
    }
  }, [categoryName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (categoryImage) {
      formData.append('categoryImage', categoryImage); // Append new image if available
    } else {
      formData.append('categoryImage', existingImage); // Append existing image if no new image
    }

    if (id) {
      formData.append('id', id);
    }
    console.log('categoryImage', categoryImage);
    console.log('existingimage', existingImage);

    try {
      await axios.post(
        'http://localhost:4000/admin/addOrEditCategory',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      navigate('/categories');
    } catch (error) {
      console.error('Error saving the category!', error);
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>
        {id ? 'Edit' : 'Add'} Category
      </h1>
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
          {existingImage && (
            <div className='mb-2'>
              <img
                src={existingImage}
                alt='Current category'
                className='w-32 h-32 object-cover'
              />
            </div>
          )}
          <input
            type='file'
            onChange={(e) => setCategoryImage(e.target.files[0])}
            className='border p-2 w-full'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          {id ? 'Save' : 'Add'} Category
        </button>
      </form>
    </div>
  );
}

export default EditCategory;
