import React, { useState } from 'react';
import Header from './Header'; // Import the Header component
import '../Templates/homepage.css';

const Homepage = () => {
  const [essay, setEssay] = useState('');
  const [citations, setCitations] = useState([]);
  const [blacklistedSites, setBlacklistedSites] = useState('');
  const [citationFormat, setCitationFormat] = useState('MLA'); // Default citation format
  const [errorMessage, setErrorMessage] = useState('');

  // Citation value: below
  const citationValue = 'MLA';

  // Function to handle essay submission
  // Function to handle essay submission
const handleSubmit = () => {
  if (!essay.trim()) {
    setErrorMessage('Please enter your paper in the text field.');
    return;
  }

  // For now, let's just split the essay into sentences and treat each sentence as a citation
  const essaySentences = essay.split('.').filter(sentence => sentence.trim() !== '');
  const generatedCitations = essaySentences.map((sentence, index) => ({
    id: index + 1,
    text: sentence.trim() + '.',
    citationValue: citationFormat, // Set the citationValue to the selected citation format
  }));

  const essayJsonData = {
    essay,
  };
  const essayJsonString = JSON.stringify(essayJsonData, null, 2);
  console.log('PaperJSON:', essayJsonString);

  // Generate JSON string for blacklisted sites
  const blacklistSitesArray = blacklistedSites.split(',').map(site => site.trim()).filter(site => site !== '');
  const blacklistJsonData = {
    blacklistedSites: blacklistSitesArray,
  };
  const blacklistJsonString = JSON.stringify(blacklistJsonData, null, 2);
  console.log('BlacklistJSON:', blacklistJsonString);

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
          style={{ width: '80%', margin: '0 auto', minHeight: '400px', textAlign: 'left' }} // Adjusted style
        />

        <textarea
          value={blacklistedSites}
          onChange={(e) => setBlacklistedSites(e.target.value)}
          placeholder="Enter blacklisted sites for your citation (ex. Wikipedia). Please split the sites with commas." // Updated placeholder text
          className="blacklist-textarea"
        />

        <br />
        <br />
        <br />

        {/* Dropdown list for citation format selection */}
        <div className="select-container">
          <select value={citationFormat} onChange={handleFormatChange} placeholder="Select Citation Format">
            <option value="MLA">MLA</option>
            <option value="Chicago">Chicago</option>
            <option value="APA">APA</option>
            <option value="IEEE">IEEE</option>
          </select>
        </div>


        <br /><br />

        <button onClick={handleSubmit}>Generate Citations</button>

        <br /><br />

        {citations.length > 0 && (
          <div className="citations">
            <h2>Citations:</h2>
            <ol> {/* Use <ol> instead of <ul> for ordered list */}
              {citations.map((citation) => (
                <li key={citation.id}>{citation.text}</li> // Wrap citation text in <li> tags
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
