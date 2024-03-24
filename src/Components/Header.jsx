import React from 'react';
// import ezCiteLogo from '../assets/svg/ezcite.svg'; // Import the SVG file
import '../Templates/header.css';

const Header = () => {
  return (
    <header className="header">
        <img src={require('../ezcite.png')} alt="Logo" />
        <div className="introduction">
            <h1>Welcome to EzCite</h1>
            <p>The premier place to get citations for your paper!</p>
        </div>
    </header>
  );
};

export default Header;
