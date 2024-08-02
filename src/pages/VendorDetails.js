import React, { useState, useEffect } from 'react';
import axios from 'axios';

function VendorDetails() {
  const [vendors, setVendors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 10;
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [viewForm, setViewForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState(''); // State for status filter
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [status, setStatus] = useState(''); // State for selected vendor status

  // Fetch vendor data based on status filter
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/vendor/vendorDetails',
          {
            params: { status: statusFilter },
          }
        );

        if (response.data.message) {
          setVendors([]);
          setErrorMessage(response.data.message);
        } else {
          setVendors(response.data);
          setErrorMessage('');
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('An error occurred while fetching vendor data.');
        }
        console.error('Error fetching vendor data:', error);
      }
    };

    fetchVendors();
  }, [statusFilter]);

  // Calculate the vendors to display on the current page
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = vendors.slice(indexOfFirstVendor, indexOfLastVendor);

  // Handle the view action
  const handleViewClick = (vendor) => {
    setSelectedVendor(vendor);
    setStatus(vendor.status); // Set the status of the selected vendor
    setViewForm(true);
  };

  // Handle status change
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // Handle form submission to update vendor status
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/vendor/updateStatus/${selectedVendor._id}`,
        { status }
      );
      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor._id === selectedVendor._id ? { ...vendor, status } : vendor
        )
      );
      setViewForm(false);
    } catch (error) {
      console.error('Error updating vendor status:', error);
      setErrorMessage('An error occurred while updating vendor status.');
    }
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(vendors.length / vendorsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Vendor Details</h1>

      {/* Status Filter Buttons */}
      <div className='mb-4'>
        <button
          onClick={() => setStatusFilter('')}
          className={`px-4 py-2 rounded ${
            !statusFilter ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-4 py-2 rounded ${
            statusFilter === 'pending'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setStatusFilter('approved')}
          className={`px-4 py-2 rounded ${
            statusFilter === 'approved'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setStatusFilter('rejected')}
          className={`px-4 py-2 rounded ${
            statusFilter === 'rejected'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className='bg-red-100 text-red-700 p-4 mb-4 rounded'>
          {errorMessage}
        </div>
      )}

      {/* Only show the table if there are vendors and no error message */}
      {!viewForm ? (
        <>
          {!errorMessage && vendors.length > 0 && (
            <>
              <table className='min-w-full bg-white border'>
                <thead>
                  <tr>
                    <th className='py-2 px-4 border-b'>Business Name</th>
                    <th className='py-2 px-4 border-b'>City</th>
                    <th className='py-2 px-4 border-b'>Province</th>
                    <th className='py-2 px-4 border-b'>Pincode</th>
                    <th className='py-2 px-4 border-b'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVendors.map((vendor) => (
                    <tr key={vendor._id}>
                      <td className='py-2 px-4 border-b'>
                        {vendor.businessname}
                      </td>
                      <td className='py-2 px-4 border-b'>{vendor.city}</td>
                      <td className='py-2 px-4 border-b'>{vendor.province}</td>
                      <td className='py-2 px-4 border-b'>{vendor.pincode}</td>
                      <td className='py-2 px-4 border-b'>
                        <button
                          onClick={() => handleViewClick(vendor)}
                          className='bg-blue-500 text-white px-3 py-1 rounded'
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <nav className='mt-4'>
                <ul className='flex justify-center'>
                  {pageNumbers.map((number) => (
                    <li key={number} className='mx-2'>
                      <button
                        onClick={() => paginate(number)}
                        className={`px-3 py-1 rounded ${
                          currentPage === number
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200'
                        }`}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </>
          )}

          {!errorMessage && vendors.length === 0 && (
            <div className='bg-gray-100 text-gray-700 p-4 mb-4 rounded'>
              No vendors found.
            </div>
          )}
        </>
      ) : (
        <div className='bg-gray-100 p-4 rounded'>
          <h2 className='text-xl font-bold mb-4'>Vendor Information</h2>
          <form onSubmit={handleFormSubmit}>
            <div className='mb-4'>
              <label className='block text-gray-700'>Business Name:</label>
              <input
                type='text'
                value={selectedVendor.businessname}
                readOnly
                className='w-full px-3 py-2 border rounded'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Description:</label>
              <textarea
                value={selectedVendor.businessdescription}
                readOnly
                className='w-full px-3 py-2 border rounded'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>City:</label>
              <input
                type='text'
                value={selectedVendor.city}
                readOnly
                className='w-full px-3 py-2 border rounded'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Province:</label>
              <input
                type='text'
                value={selectedVendor.province}
                readOnly
                className='w-full px-3 py-2 border rounded'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Pincode:</label>
              <input
                type='text'
                value={selectedVendor.pincode}
                readOnly
                className='w-full px-3 py-2 border rounded'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Business Images:</label>
              {selectedVendor.businessImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt='Business'
                  className='my-2 w-80 h-auto'
                />
              ))}
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Status:</label>
              <select
                value={status}
                onChange={handleStatusChange}
                className='w-full px-3 py-2 border rounded'
              >
                <option value='pending'>Pending</option>
                <option value='approved'>Approved</option>
                <option value='rejected'>Rejected</option>
              </select>
            </div>
            <button
              type='submit'
              className='bg-blue-500 text-white px-3 py-1 rounded mr-2'
            >
              Update Status
            </button>
            <button
              onClick={() => setViewForm(false)}
              className='bg-gray-500 text-white px-3 py-1 rounded'
            >
              Back
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default VendorDetails;
