import React from 'react';
import ezCiteLogo from '../assets/svg/ezcite.svg'; // Import the SVG file
import '../Templates/header.css';
import { ReactComponent as EzCiteLogo } from '../assets/svg/ezcite.svg';


const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={ezCiteLogo} alt="Logo" className="logo"/>
        <div className="introduction">
          <h1>Welcome to EzCite!</h1>
          <p>The number 1 place to get citations for your paper.</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
