require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const axios = require('axios');
const db = require('../db');

const SKYSCANNER_API_URL = 'https://partners.api.skyscanner.net/apiservices/v3/autosuggest/flights';

const fetchAirportsForCountry = async (country) => {
    try {
        console.log(process.env.SKYSCANNER_API_KEY);
        const response = await axios.post(SKYSCANNER_API_URL, {
            query: {
                market: 'UK',
                locale: 'en-GB',
                searchTerm: country.name
            },
            limit: 20
        }, {
            headers: {
                'x-api-key': process.env.SKYSCANNER_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        const places = response.data.places || [];
        console.log(places);
        const airports = places.filter(p => p.type === 'PLACE_TYPE_AIRPORT');


        for (const airport of airports) {
            const id = airport.entityId;
            const name = airport.name;
            const iata = airport.iataCode || null;
            const city = airport.cityName || null;
            const country_code = country.code;
            const country_name = country.name;

            await db.query(`
        INSERT OR IGNORE INTO airport (id, name, iata, city, country_code, country_name)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [id, name, iata, city, country_code, country_name]);
        }

        console.log(`✓ ${airports.length} airports saved for ${country.name}`);
    } catch (err) {
        console.error(`✗ Error fetching airports for ${country.name}:`, err.response?.data || err.message);
    }
};

const fetchAllAirports = async () => {
    const result = await db.query('SELECT code, name FROM country');
    const countries = result.rows;

    for (const country of countries) {
        await fetchAirportsForCountry(country);
        await new Promise(res => setTimeout(res, 1000)); // Delay to avoid rate limits
    }

    console.log('✅ All airport data fetched.');
};

fetchAllAirports();
