import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <header className='header'>
      <div className='logo'>
        <img src='/images/logo.png' alt='ServcieSpot Logo' />
      </div>
      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link to='/'>Admin Panel</Link>
          </li>
          {/* <li>
            <a href='#about'>About Us</a>
          </li>
          <li>
            <Link to='/VendorRegister'>Become a Vendor</Link>
          </li> */}

          <div className='user-profile'>
            <Link to='/Login'>
              <img src='/images/add-user.png' alt='User' />
            </Link>
          </div>
        </ul>
      </nav>
      <button className='hamburger' onClick={toggleMenu}>
        <i className='fas fa-bars'></i>
      </button>
    </header>
  );
}

export default Header;
