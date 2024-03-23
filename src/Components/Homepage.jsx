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

    setCitations(generatedCitations);

    // Generate JSON file
    //generateJSON(generatedCitations);
  };

  // Function to generate JSON file
  const generateJSON = (data) => {
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'citations.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

        <textarea
          value={blacklistedSites}
          onChange={(e) => setBlacklistedSites(e.target.value)}
          placeholder="Enter blacklisted sites"
          className="blacklist-textarea"
        />
        <br /><br /><br /><br />

        <button onClick={handleSubmit}>Generate Citations</button>

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

        {/* Blacklist textarea */}
       <br /><br /><br /><br /><br /><br />
        
      </div>
    </div>
  );
};

export default Homepage;
