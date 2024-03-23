import React, { useState } from 'react';
import Header from './Header'; // Import the Header component
import '../Templates/homepage.css';

const Homepage = () => {
  const [essay, setEssay] = useState('');
  const [citations, setCitations] = useState([]);
  const [blacklistedSites, setBlacklistedSites] = useState('');

  // Function to handle essay submission
const handleSubmit = () => {
  // Here you would implement the logic to process the essay and generate citations
  // Replace the following lines with your actual citation generation logic

  // For now, let's just split the essay into sentences and treat each sentence as a citation
  const essaySentences = essay.split('.').filter(sentence => sentence.trim() !== '');
  const generatedCitations = essaySentences.map((sentence, index) => ({
    id: index + 1,
    text: sentence.trim() + '.',
  }));

  const essayJsonData = {
    essay,
  };
  const essayJsonString = JSON.stringify(essayJsonData, null, 2);
  console.log('Essay JSON:', essayJsonString);

  // Generate JSON string for blacklisted sites
  const blacklistJsonData = {
    blacklistedSites: blacklistedSites.split('\n').filter(site => site.trim() !== ''),
  };
  const blacklistJsonString = JSON.stringify(blacklistJsonData, null, 2);
  console.log('Blacklist JSON:', blacklistJsonString);

  setCitations(generatedCitations);
};



  return (
    <div className="homepage">
      <Header /> {/* Include the Header component */}

      <div className="content">
        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder="Enter paper"
          style={{ width: '30%', margin: '0 auto', minHeight: '100px', textAlign: 'center' }} // Adjusted style
        />
        <br />         
        <br />
        <textarea
          value={blacklistedSites}
          onChange={(e) => setBlacklistedSites(e.target.value)}
          placeholder="Enter blacklisted sites"
          className="blacklist-textarea"
        />
        <br />

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
