import React, { useState, useEffect } from 'react';
import '../Templates/header.css';

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY;
      setIsVisible(top <= 100); // Adjust this value as needed
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
  <header className={`header ${isVisible ? 'visible' : 'hidden'}`}>
      <img src={require('../ezcite.png')} alt="Logo" />
      <div className="introduction">
        <h1>Welcome to EzCite!</h1>
        <p>The Best Place to Get Citations for Your Paper.</p>
      </div>

    </header>
  );
};

export default Header;
