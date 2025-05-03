require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function suggestCities(preferences) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
You are a travel recommendation assistant.

Based on the user's preferences, suggest exactly 5 cities that have major international airports.
Do not include country names, explanations, or duplicates — just the city names in English, one per line.

User preferences:
${preferences}

Format:
City1
City2
...
City15
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // 🛠️ Transform text into array
    const cities = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && /^[a-zA-Z\s\-]+$/.test(line));

    return cities; // ✅ Must return an array
  } catch (error) {
    console.error('Error with Gemini API:', error.message);
    return []; // ✅ Always return an array
  }
}

module.exports = { suggestCities };
