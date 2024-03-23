import React, { useState } from 'react';
import Header from './Header'; // Import the Header component
import '../Templates/homepage.css';

const Homepage = () => {
  const [essay, setEssay] = useState('');
  const [citations, setCitations] = useState([]);

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
  };

  return (
    <div className="homepage">
      <Header /> {/* Include the Header component */}

      <div className="content">
        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder="Enter your essay here..."
          style={{ width: '30%', margin: '0 auto', minHeight: '100px', textAlign: 'center' }} // Adjusted style
        />
        <br /> 
        <button onClick={handleSubmit}>Generate Citations</button>

        {citations.length > 0 && (
          <div className="citations">
            <h2>Citations:</h2>
            <ul>
              {citations.map((citation) => (
                <li key={citation.id}>{citation.text}</li> // Wrap citation text in <li> tags
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
