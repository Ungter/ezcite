// --------------- Imports --------------- 
const axios = require('axios')
const { OpenAI } = require('openai')
const openaiAPI = ""
const openai = new OpenAI({
    apiKey: openaiAPI
})
const perplexity = new OpenAI({
    apiKey: openaiAPI,
    base_url: "https://api.perplexity.ai"
})

// --------------- User input varibles ---------------

let inputPrompt = "Roe v. Wade, 410 U.S. 113 (1973),[1] was a landmark decision of the U.S. Supreme Court in which the Court ruled that the Constitution of the United States generally protected a right to have an abortion. The decision struck down many abortion laws, and caused an ongoing abortion debate in the United States about whether, or to what extent, abortion should be legal, who should decide the legality of abortion, and what the role of moral and religious views in the political sphere should be.[2][3] The decision also shaped debate concerning which methods the Supreme Court should use in constitutional adjudication."
let blacklistedWebsites;
let citeStyle;

// --------------- Non-AI Helper Functions ---------------

function setBlacklistedWebsites() {

}

async function queryCiteLinks(query) {

}

async function helperGetLinks() {
    setLinksSourcesByAI().then((result) => {
        console.log(result)
        return result
    })
}

// --------------- AI Functions ---------------

async function getMainPromptIdeas() {
    const systemPrompt = "Identify a single phrase main topic, and summarize key short sentences, each short sentence should start with the single phrase topic. Use JSON output format"
    const response = await openai.chat.completions.create({
        model: "gpt-4-0125-preview",
        response_format: { type: "json_object" },
        seed: 1,
        messages: [
            {role: "system", content: systemPrompt},
            {role: "user", content: inputPrompt}
        ]
    })
    console.log(response.choices[0].message.content)
    return response.choices[0].message.content
}

async function setLinksSourcesByAI() {
    let textToCite = await getMainPromptIdeas()
    const systemPrompt = `Identify possible creditble sources from the text, output in links. Use JSON output format.`

    const response = await perplexity.chat.completions.create({
        model: "gpt-4-0125-preview",
        response_format: { type: "json_object" },
        seed: 1,
        messages: [
            {role: "system", content: systemPrompt},
            {role: "user", content: textToCite}
        ]
    })

    return response.choices[0].message.content
}
