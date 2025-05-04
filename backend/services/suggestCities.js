require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function suggestCities(preferences) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
    You are a travel recommendation assistant.
    
    Based on the user's preferences, suggest exactly 5 cities that have major international airports.
    For each city, include 3 to 5 succinct tags that reflect why this city matches the user's preferences.
    Do not include country names, explanations or duplicates—only the city name in English followed by a JSON-style array of tags.
    
    User preferences:
    ${preferences}
    
    Output format (one city per line):
    City1: ["tag1","tag2","tag3"]
    City2: ["tagA","tagB","tagC","tagD"]
    City3: ["tagX","tagY","tagZ"]
    City4: ["tagM","tagN","tagO","tagP"]
    City5: ["tagU","tagV","tagW"]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Transform text into array of { city, tags }
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    const cities = lines.map(line => {
      const [city, tags] = line.split(':').map(s => s.trim());
      let arr;
      try {
        arr = JSON.parse(tags);
      } catch {
        arr = [];
      }
      return { city, tags: Array.isArray(arr) ? arr : [] };
    });

    return cities; 
  } catch (error) {
    console.error('Error with Gemini API:', error.message);
    return []; 
  }
}

module.exports = { suggestCities };
