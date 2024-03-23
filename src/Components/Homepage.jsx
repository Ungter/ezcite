import React, { useState } from 'react';
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
        <img src={require('../logo.png')} alt="Logo" style={{ width: '150px', height: '100px' }}/>

      <h1>Welcome to Essay Citation Generator</h1>
      <textarea
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
        placeholder="Enter your essay here..."
        rows={10}
        cols={50}
      />
      <button onClick={handleSubmit}>Generate Citations</button>

      {citations.length > 0 && (
        <div className="citations">
          <h2>Possible Citations:</h2>
          <ul>
            {citations.map((citation) => (
              <li key={citation.id}>{citation.text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Homepage;
