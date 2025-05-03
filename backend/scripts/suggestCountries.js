require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function suggestCountries(preferences) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
    You are a travel recommendation assistant.
    
    Based on the user's preferences, suggest exactly 5 -10 countries to visit.
    Return only the country names, in English, one per line — no explanations.
    
    User preferences:
    ${preferences}
    
    Format:
    Country1
    Country2
    Country3
    Country4
    Country5
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    console.log('Suggested countries:\n', text);
    return text;
  } catch (error) {
    console.error('Error with Gemini API:', error.message);
  }
}

// Puedes probar con lo que quieras
suggestCountries("safety, nature, mountains, low cost, good food");
