import React, { useState, useEffect } from 'react';
import Header from './Header'; // Import the Header component
import '../Templates/homepage.css';
import axios from 'axios';
import puppeteer from 'puppeteer';
import { OpenAI } from 'openai';

const openaiAPI = "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"; // Your OpenAI API key
const openai = new OpenAI({ apiKey: openaiAPI });
const perplexity = new OpenAI({ apiKey: openaiAPI, base_url: "https://api.perplexity.ai" });

const Homepage = () => {
  const [essay, setEssay] = useState('');
  const [citations, setCitations] = useState([]);
  const [blacklistedSites, setBlacklistedSites] = useState('');
  const [citationFormat, setCitationFormat] = useState('MLA');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (essay.trim()) {
      queryCiteLinks(); // Trigger queryCiteLinks when essay is not empty
    }
  }, [essay]); // Run when essay changes

  const handleSubmit = () => {
    if (!essay.trim()) {
      setErrorMessage('Please enter your paper in the text field.');
      return;
    }
    queryCiteLinks(); // Trigger queryCiteLinks on form submission
  };

  const handleFormatChange = (event) => {
    setCitationFormat(event.target.value);
    console.log('CitationFormat:', event.target.value);
  };

  async function queryCiteLinks() {
    const jsonString = await setLinksSourcesByAI();
    try {
      const data = JSON.parse(jsonString);
      const credibleSources = data.credible_sources;

      if (Array.isArray(credibleSources)) {
        const citationPromises = credibleSources.map((url) => createCitation(citationFormat.toLowerCase(), url));
        const generatedCitations = await Promise.all(citationPromises);
        setCitations(generatedCitations);
      } else {
        console.log("'credible_sources' is not an array in the JSON string, trying again.");
        queryCiteLinks();
      }
    } catch (error) {
      console.log("Error parsing JSON string:", error);
    }
  }

  async function createCitation(citationStyle, url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://www.citationmachine.net/${citationStyle}/cite-a-website`, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('#search-input');
    await page.type('#search-input', url);

    await page.waitForSelector('#search-input');
    await page.click('button[type=submit]');

    await page.waitForSelector('button[data-test="cite-button"]');
    await page.click('button[data-test="cite-button"]');

    await page.waitForSelector('button[data-test="submit-eval"]');
    await page.click('button[data-test="submit-eval"]');

    await page.waitForSelector('button[data-test="create-citation-button-form"]');
    await page.click('button[data-test="create-citation-button-form"]');

    await page.waitForSelector('[class^="styled__InnerWrapper"]');
    await page.waitForSelector('p[data-test="citation-text"]');

    const citation = await page.evaluate(() => {
      return document.querySelector('p[data-test="citation-text"]').textContent;
    });

    await browser.close();
    return citation;
  }

  async function getMainPromptIdeas() {
    const systemPrompt = "Identify a single phrase main topic, and summarize key short sentences, each short sentence should start with the single phrase topic. Use JSON output format";
    const response = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      response_format: { type: "json_object" },
      seed: 1117,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: essay }
      ]
    });

    return response.choices[0].message.content;
  }

  async function setLinksSourcesByAI() {
    let textToCite = await getMainPromptIdeas();
    const systemPrompt = `Identify possible "credible_sources":[] from the text, output in links. Use JSON output format.`;

    const response = await perplexity.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      seed: 1117,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: textToCite }
      ]
    });

    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  }

  return (
    <div className="homepage">
      <Header />
      <div className="content">
        {/* Your existing JSX content */}
        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder="Enter your paper here"
        />
        <button onClick={handleSubmit}>Generate Citations</button>
        <select value={citationFormat} onChange={handleFormatChange}>
          <option value="MLA">MLA</option>
          <option value="APA">APA</option>
          {/* Add more citation format options */}
        </select>
        {errorMessage && <p>{errorMessage}</p>}
        <ul>
          {citations.map((citation, index) => (
            <li key={index}>{citation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Homepage;
