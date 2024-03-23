import React from 'react';
import './App.css';
import Homepage from './Components/Homepage.jsx'; // Import the Homepage component
import Header from './Components/Header.jsx';

function App() {
  return (
    <div className="App">
      <Header/>
      <Homepage />
    </div>
  );
}

export default App;
