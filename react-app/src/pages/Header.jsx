import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Header.css';

const Header = () => {
  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo or Brand Name */}
        <div className="brand">
          <a href="/">Metakitz</a>
        </div>

        {/* Navigation Links */}
        <nav className="site-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/">Services</Link></li>
            <li><Link to="/">Contact</Link></li>
          </ul>
        </nav>

        {/* Action Buttons (e.g., Auth or CTA) */}
        <div className="header-actions">
          <button className="btn-login">Log In</button>
          <button className="btn-signup">Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header;