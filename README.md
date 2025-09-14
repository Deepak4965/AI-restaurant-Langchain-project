🍽️ AI Restaurant Assistant (LangChain + Google Gemini)

This project is a Smart Restaurant AI Assistant built using LangChain and Google Gemini (gemini-2.5-flash).
It is designed to handle restaurant-related queries like menu recommendations, FAQs, and more using AI agents.

🚀 Features

Backend server built with Node.js + Express.js

Integrated Google Gemini via LangChain

Custom tool getMenu implemented with DynamicStructuredTool

Zod schema validation for input (Breakfast, Lunch, Dinner)

Prompt templates with system / human / agent scratchpad messages

Agent built using createToolCallingAgent for tool-driven responses

Example API endpoint (GET /) running on port 3000

💻 Example Usage

User: What’s for dinner today?
Assistant: Veg Biryani, Raita, Salad, Gulab Jamun 🍽️

📂 Project Structure
AI-restaurant-Langchain-project/
│── index.js          # Main application file
│── package.json      # Dependencies and scripts
│── .env              # Environment variables (API keys)
│── /node_modules     # Installed dependencies

⚙️ Installation & Setup

Clone the repository:

git clone https://github.com/Deepak4965/AI-restaurant-Langchain-project.git
cd AI-restaurant-Langchain-project


Install dependencies:

npm install


Create a .env file in the project root and add your API key:

GOOGLE_API_KEY=your_api_key_here


Run the server:

node index.js


Open in your browser:

http://localhost:3000

🛠️ Tech Stack

Node.js – Backend framework

Express.js – Web server

LangChain – Agent & tool management

Google Gemini (gemini-2.5-flash) – LLM integration

Zod – Schema validation
