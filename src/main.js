// --------------- Imports --------------- 
const axios = require('axios')


// --------------- User input varibles ---------------

let inputPrompt = "With the advances in Machine Learning, there is a growing interest in AI-enabled tools for autocompleting source code. GitHub Copilot, also referred to as the AI Pair Programmer, has trained on billions of lines of open source GitHub code, and is one of such tools that has been increasingly used since its launch on June 2021. However, little effort has been devoted to understand the practices and challenges of using Copilot in programming with auto-completed source code. To this end, we conducted an empirical study by collecting and analyzing the data from Stack Overflow (SO) and GitHub Discussions. More specifically, we searched and manually collected 169 SO posts and 655 GitHub discussions related to the usage of Copilot. We identified the programming languages, IDEs, technologies used with Copilot, functions implemented, benefits, limitations, and challenges when using Copilot. The results show that when practitioners use Copilot: (1) The major programming languages used with Copilot are JavaScript and Python, (2) the main IDE used with Copilot is Visual Studio Code, (3) the most common used technology with Copilot is Node.js, (4) the leading function implemented by Copilot is data processing, (5) the significant benefit of using Copilot is useful code generation, and (6) the main limitation encountered by practitioners when using Copilot is difficulty of integration. Our results suggest that using Copilot is like a double-edged sword, which requires developers to carefully consider various aspects when deciding whether or not to use it. Our study provides empirically grounded foundations and basis for future research on the role of Copilot as an AI pair programmer in software development."
let blacklistedWebsites;
let citeStyle;

// --------------- System varibles ---------------

const claudeAPIKey = ""
let keyIdeasFromPrompt;
let sourcesFromMemory;
let sourcesFromWeb;

// --------------- Functions ---------------

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
    } 
    catch (error) {
        const systemPrompt = "Convert the input into a valid JSON format. Use JSON output format."
        return await callAI("sonnet", systemPrompt, response)
    }
}

JSONhelper().then((result) => {
    console.log(result)
})

