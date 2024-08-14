import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function EditSubCategory() {
  // const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subcategoryImage, setSubCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [subcategoryId, setSubcategoryId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subcategoryName = queryParams.get('name');

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await axios.get(
  //         'http://localhost:4000/admin/fetchCategories'
  //       );
  //       setCategories(response.data);
  //     } catch (error) {
  //       console.error('There was an error fetching categories!', error);
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  useEffect(() => {
    if (subcategoryName) {
      const fetchSubCategory = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/admin/fetchPerticularSubCategory?name=${subcategoryName}`
          );
          const subcategory = response.data[0]; // Assuming response.data is an array

          if (subcategory) {
            setSubcategoryId(subcategory._id); // Set the subcategory ID for editing
            setName(subcategory.name);
            setDescription(subcategory.description);
            setSelectedCategory(subcategory.category.name); // Set the selected category name directly
            setImagePreview(subcategory.subcategoryImage[0]); // Set image preview URL
            setIsEditing(true);
          }
        } catch (error) {
          console.error('There was an error fetching subcategory!', error);
        }
      };

      fetchSubCategory();
    }
  }, [subcategoryName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Selected Category:', selectedCategory);

    // Directly use selectedCategory as it is set to the category name
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('CategoryName', selectedCategory); // Use selectedCategory directly

    // Append subcategory image if provided
    if (subcategoryImage) {
      formData.append('subcategoryImage', subcategoryImage);
    }

    // Append ID if editing
    if (isEditing) {
      formData.append('id', subcategoryId); // Add the ID if editing
    }
    console.log('formdata', formData);
    try {
      // Send POST request
      await axios.post(
        'http://localhost:4000/admin/addOrEditSubcategory',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      navigate('/subcategories');
    } catch (error) {
      console.error(
        'There was an error adding or editing the category!',
        error
      );
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>
        {isEditing ? 'Edit Sub Category' : 'Add Sub Category'}
      </h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='mb-4'>
          <label className='block mb-1'>Category</label>
          <input
            type='text'
            value={selectedCategory} // Display the selected category name
            readOnly
            className='border p-3 w-full'
          />
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
          <label className='block mb-1'>Sub Category Image</label>
          {imagePreview && (
            <div className='mb-2'>
              <img
                src={imagePreview}
                alt='Subcategory Preview'
                style={{ maxWidth: '200px', height: 'auto' }}
              />
            </div>
          )}
          <input
            type='file'
            onChange={(e) => setSubCategoryImage(e.target.files[0])}
            className='border p-2 w-full'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          {isEditing ? 'Update Category' : 'Save Category'}
        </button>
      </form>
    </div>
  );
}

export default EditSubCategory;
