require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const axios = require('axios');
const db = require('../db');

const saveCountries = async () => {
  try {
    const response = await axios.get('https://partners.api.skyscanner.net/apiservices/v3/culture/markets/en-GB', {
      headers: {
        'x-api-key': process.env.SKYSCANNER_API_KEY
      }
    });

    const countries = response.data.markets;

    for (const country of countries) {
      await db.query(`
        INSERT OR IGNORE INTO country (code, name, currency)
        VALUES (?, ?, ?)
      `, [country.code, country.name, country.currency]);
    }

    console.log(`✓ Guardados ${countries.length} países en la base de datos`);
  } catch (err) {
    console.error('✗ Error guardando países:', err.message);
  }
};

saveCountries();
