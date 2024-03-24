onst puppeteer = require('puppeteer');

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

createCitation('chicago', 'https://www.reuters.com/world/politics-economics-behind-bidens-china-car-espionage-probe-2024-03-01/').then(citation => {
  console.log(citation);
});
