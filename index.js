import { config } from "dotenv";
import express from 'express'
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { DynamicStructuredTool } from "langchain/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from 'zod'
import path from 'path'


config()
const app = express()
const PORT = 3000
app.use(express.json())
const __dirname = path.resolve()

const model = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",  // Free-tier model
    maxOutputTokens: 2048,
    temperature: 0.7,
    apiKey: process.env.Google_API_KEY,
})

const getMenuTool = new DynamicStructuredTool({
    name: 'getMenuTool',
    description: "Returns the final answer for today's menu for the given category (Breakfast,Lauch,Dinner). Use this tool to directly answer the user's menu question.",
    schema: z.object({
        category: z.string().describe("Type of food. Example: breakfast,lunch,dinner"),
    }),
    func: async ({ category }) => {
        const menus = {
            breakfast: "Aloo, Poha, Masala Chai",
            lunch: "Panner Butter Masala, Dal Fry, Jeera Rice, Roti",
            dinner: "Veg Biryani, Ratia, Salad, Gulab Jamun",
        }
        return menus[category.toLowerCase()] || "No menu found for that category";
    },
});

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant that uses tools when needed."],
    ["human", "{input}"],
    ["ai", "{agent_scratchpad}"]
]);

const agent = await createToolCallingAgent({
    llm: model,
    tools: [getMenuTool],
    prompt,
});

const executor = await AgentExecutor.fromAgentAndTools({
    agent,
    tools: [getMenuTool],
    verbose: true,
    maxIterations: 5,
    returnIntermediateSteps: true,
})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post("/api/chat", async (req, res) => {
    const userInput = req.body.input
    console.log("userInput: ", userInput);
    try {
        const response = await executor.invoke({ input: userInput })
        console.log("Agent full Response:", response);
        const data = response.intermediateSteps[0].observation

        if (response.output && response.output != "Agent stopped due to max iterations. ") {
            return res.json({ output: response.output })
        }
        else if (data != null) {
            return res.json({ output: data })
        }
        res.status(500).json({ output: "Agent couldn't find a valid answer." })
    }
    catch (error) {
        console.log("Error during agent execution: ", error);
        res.status(500).json({ output: "Sorry, something went wrong. Please try again." })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})