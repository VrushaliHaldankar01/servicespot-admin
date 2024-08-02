import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Categories from './pages/Categories';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SubCategories from './pages/Subcategories';
import PopularCategories from './pages/PopularCategories.js';
import TrendingCategories from './pages/TrendingCategories.js';
import AddCategory from './pages/AddCategory.js';
import AddSubCategory from './pages/AddSubCategory.js';
import EditCategory from './pages/EditCategory.js';
import EditSubCategory from './pages/EditSubcategory.js';
import VendorDetails from './pages/VendorDetails.js';
import Login from './pages/Login.jsx';
// export default App;

function App() {
  return (
    <Router>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <div className='flex flex-grow'>
          <Sidebar />
          <main className='flex-grow p-4'>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/categories' element={<Categories />} />
              <Route path='/subcategories' element={<SubCategories />} />
              <Route
                path='/popularcategories'
                element={<PopularCategories />}
              />
              <Route
                path='/trendingcategories'
                element={<TrendingCategories />}
              />
              <Route path='/vendordetails' element={<VendorDetails />} />
              <Route path='/add-category' element={<AddCategory />} />
              <Route path='/add-sub-category' element={<AddSubCategory />} />
              <Route path='/edit-category' element={<EditCategory />} />
              <Route path='/edit-sub-category' element={<EditSubCategory />} />
            </Routes>
          </main>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
