// --------------- Imports --------------- 
const axios = require('axios')
const google = require('googlethis')
const fs = require('fs')

// --------------- User input varibles ---------------

let inputPrompt = "Roe v. Wade, 410 U.S. 113 (1973),[1] was a landmark decision of the U.S. Supreme Court in which the Court ruled that the Constitution of the United States generally protected a right to have an abortion. The decision struck down many abortion laws, and caused an ongoing abortion debate in the United States about whether, or to what extent, abortion should be legal, who should decide the legality of abortion, and what the role of moral and religious views in the political sphere should be.[2][3] The decision also shaped debate concerning which methods the Supreme Court should use in constitutional adjudication."
let blacklistedWebsites;
let citeStyle;

// --------------- System varibles ---------------

const claudeAPIKey = ""
let keyIdeasFromPrompt;
let sourcesFromMemory;
let sourcesFromWeb;

// --------------- Non-AI Helper Functions ---------------

function setBlacklistedWebsites() {

}

async function googleSearch(query) {
    const options = {
        page: 0,
        safe: false,
        parse_ads: false,
        additional_params: {
            hl: 'en',
            num: 10
        }
    }

    // Create an array to hold all the promises
    const promises = query.map(item => google.search(item, options));

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    // Write the results to a JSON file
    fs.writeFile('results.json', JSON.stringify(results, null, 2), (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}

// --------------- AI Functions ---------------

async function callAI(model, system, prompt ) {

    let selectedModel;

    if (prompt === undefined) {
        return null;
    }

    switch (model) {
        case "sonnet":
            selectedModel = "claude-3-sonnet-20240229";
            break;
        case "haiku":
            selectedModel = "claude-3-haiku-20240307";
            break;
        case "opus":
            selectedModel = "claude-3-opus-20240229";
            break;
        default:
            selectedModel = "claude-3-haiku-20240307";
            break;
    } 

    let response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: selectedModel,
        max_tokens: 1024,
        system: system,
        messages: [ 
            {role: "user", content: prompt},
            {role: "assistant", content: "{"}
        ]
    }, {
        headers: {
            "x-api-key": claudeAPIKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
    }) 

    return response.data.content[0].text
}

async function getMainPromptIdeas() {
    const systemPrompt = "Identify and summarize key short sentences, start with the first key idea and do not include anything else. Use JSON output format"
    return await callAI("haiku", systemPrompt, inputPrompt)
}

async function JSONhelper() {
    let response = await getMainPromptIdeas();

    try {
        JSON.parse(response);
        return response;
    } catch (error) {
        const systemPrompt = "Convert the input into a valid JSON format. Use JSON output format."
        return await callAI("sonnet", systemPrompt, response)
    }
}

async function determineSources() {
    let textToCite = await JSONhelper()
    const systemPrompt = `Identify possible sources from the text and cite them in MLA format. If not certain, do NOT cite them and output "N/A". Use JSON output format and NOTHING ELSE.`
    return await callAI("opus", systemPrompt, textToCite)
}

determineSources().then((result) => {
    console.log(result)
})
