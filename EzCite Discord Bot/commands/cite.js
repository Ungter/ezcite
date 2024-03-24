const {
    SlashCommandBuilder
} = require('discord.js');
const axios = require('axios')
const puppeteer = require('puppeteer');
const {
    OpenAI
} = require('openai')
const openaiAPI = ""
const openai = new OpenAI({
    apiKey: openaiAPI
})
const perplexity = new OpenAI({
    apiKey: openaiAPI,
    base_url: "https://api.perplexity.ai"
})

module.exports = {

    data: new SlashCommandBuilder()
        .setName('cite')
        .setDescription('You can send a message, or the ID of it')
        .addStringOption(option =>
            option
            .setName('msg')
            .setDescription('the message')
            .setRequired(true))
        .addStringOption(option =>
            option
            .setName('format')
            .setRequired(true)
            .setDescription('the format of the citation')
            .addChoices({
                name: 'MLA',
                value: 'mla'
            }, {
                name: 'APA',
                value: 'apa'
            }, {
                name: 'Chicago',
                value: 'chicago'
            }, {
                name: 'IEEE',
                value: 'ieee'
            }, )),

    async execute(interaction) {
        const msg = interaction.options.getString('msg')
        const citeStyle = interaction.options.getString('format')
        
        var inputPrompt = await interaction.options.getString('msg')

        try {
            messageFromID = await interaction.channel.messages.fetch(msg)
            console.log(messageFromID.attachments.size)
            if (messageFromID.attachments.size > -1) {
                console.log("message contains a text file")
                const attach = messageFromID.attachments.first()
                if (attach.name.endsWith(".txt")) {
                    const response = await axios.get(attach.url)
                    inputPrompt = response.data
                    console.log(inputPrompt)
                }
            } else {
                inputPrompt = messageFromID.content
            }
        } catch(any) {
            console.log("message is not an message ID (check if error really is snowflake -->)  ");
            inputPrompt = msg
        }

        console.log("\nprompt: " + msg)

        await interaction.reply('thinking...');
        await queryCiteLinks();

        // --------------- Non-AI Helper Functions ---------------

        async function queryCiteLinks() {
            const jsonString = await setLinksSourcesByAI().then((result => {
                return result
            }))

            try {
                const data = JSON.parse(jsonString);
                const credibleSources = data.credible_sources;

                if (Array.isArray(credibleSources)) {
                    for (const url of credibleSources) {
                        await interaction.channel.send(await createCitation(citeStyle, url));
                    }
                } else {
                    console.log("'credible_sources' is not an array in the JSON string, trying again.");
                    queryCiteLinks();
                }
            } catch (error) {
                console.log("Error parsing JSON string:", error);
            }

            await interaction.channel.send("Citation complete!");
        }

        async function createCitation(citationStyle, url) {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto(`https://www.citationmachine.net/${citationStyle}/cite-a-website`, {
                waitUntil: 'domcontentloaded'
            });

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

        // --------------- AI Functions ---------------

        async function getMainPromptIdeas() {
            const systemPrompt = "Identify a single phrase main topic, and summarize key short sentences, each short sentence should start with the single phrase topic 'phrases': []. Use JSON output format"
            const response = await openai.chat.completions.create({
                model: "gpt-4-0125-preview",
                response_format: {
                    type: "json_object"
                },
                seed: 1117,
                messages: [{
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: inputPrompt
                    }
                ]
            })

            console.log(response.choices[0].message.content)
            return response.choices[0].message.content
        }

        async function setLinksSourcesByAI() {
            let textToCite = await getMainPromptIdeas()
            const systemPrompt = `Identify possible "credible_sources":[] from the text, output in links. Use JSON output format .`

            const response = await perplexity.chat.completions.create({
                model: "gpt-4-0125-preview",
                response_format: {
                    type: "json_object"
                },
                messages: [{
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: textToCite
                    }
                ]
            })

            console.log(response.choices[0].message.content)
            return response.choices[0].message.content
        }
    },
}