require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getCitySummaries(cityNames) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0' }); // Use the more complete model
  
      const prompt = `
  You are a concise travel assistant.
  
  For each city listed below, provide a 2 to 3 sentence summary that highlights what makes it appealing to travelers.
  Keep the summaries informative, engaging, and focused on unique qualities (e.g. culture, nature, food, landmarks).
  Avoid repeating generic phrases. Use only English. Do not mention the country name.
  
  Cities:
  ${cityNames.join('\n')}
  
  Format:
  City1: <summary>
  City2: <summary>
  ...
  `;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
  
      // Convert the result to an object: { city: summary }
      const summaries = {};
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
      for (const line of lines) {
        const [city, summary] = line.split(':').map(part => part.trim());
        if (city && summary) {
          summaries[city] = summary;
        }
      }
  
      return summaries;
  
    } catch (error) {
      console.error('Error fetching city summaries:', error.message);
      return {};
    }
  }
  
  module.exports = { getCitySummaries };