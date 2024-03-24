import React, { useState } from 'react';
import Header from './Header'; // Import the Header component
import '../Templates/homepage.css';

const Homepage = () => {
  const [essay, setEssay] = useState('');
  const [citations, setCitations] = useState([]);
  const [blacklistedSites, setBlacklistedSites] = useState('');
  const [citationFormat, setCitationFormat] = useState('MLA'); // Default citation format
  const [errorMessage, setErrorMessage] = useState('');

  // Function to handle essay submission
  const handleSubmit = () => {
    if (!essay.trim()) {
      setErrorMessage('Please enter your paper in the text field.');
      return;
    }

    // Split the essay into sentences and treat each sentence as a citation
    const essaySentences = essay.split('.').filter(sentence => sentence.trim() !== '');
    const generatedCitations = essaySentences.map((sentence, index) => ({
      id: index + 1,
      text: sentence.trim() + '.',
      citationValue: citationFormat,
    }));

    setCitations(generatedCitations);
    setErrorMessage(''); // Clear error message if submission is successful
  };

  // Function to handle citation format change
  const handleFormatChange = (event) => {
    setCitationFormat(event.target.value);
    console.log('CitationFormat:', event.target.value);
  };

  return (
    <div className="homepage">
      <Header /> {/* Include the Header component */}

      <div className="content">
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message if present */}
        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder="Enter your paper here..."
          style={{ width: '80%', margin: '0 auto', minHeight: '400px', textAlign: 'left' }}
        />
        <br />
        <br />

        <textarea
          value={blacklistedSites}
          onChange={(e) => setBlacklistedSites(e.target.value)}
          placeholder="Enter blacklisted sites for your citation (ex. Wikipedia). Please split the sites with commas."
          className="blacklist-textarea"
        />

        <br />
        <br />

        {/* Container for dropdown and button */}
        <div className="select-button-container">
          {/* Dropdown list for citation format selection */}
          <div className="select-container">
            <select value={citationFormat} onChange={handleFormatChange} placeholder="Select Citation Format">
              <option value="MLA">MLA</option>
              <option value="Chicago">Chicago</option>
              <option value="APA">APA</option>
              <option value="IEEE">IEEE</option>
            </select>
          </div>

          {/* Generate Citations button */}
          <button onClick={handleSubmit}>Generate Citations</button>
        </div>

        <br /><br />

        {/* Render citations if available */}
        {citations.length > 0 && (
          <div className="citations">
            <h2>Citations:</h2>
            <ol>
              {citations.map((citation, index) => (
                <li key={index}>{citation.text} [{citation.citationValue}]</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
