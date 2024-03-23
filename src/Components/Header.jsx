import React from 'react';
import '../Templates/header.css';

const Header = () => {
  return (
    <header className="header">
      <img src={require('../ezcite.png')} alt="Logo" style={{width:'200px', height:'60px'}} />
    </header>
  );
};

export default Header;
