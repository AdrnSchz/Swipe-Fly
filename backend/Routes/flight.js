const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const { suggestCities } = require('../services/suggestCities');
dotenv.config();
const router = express.Router();

// --- Helper para simplificar vuelos ---
function simplifyFlightsFromPoll(pollData) {
    const itineraries = pollData.content.results.itineraries;
    const legs = pollData.content.results.legs;
    const places = pollData.content.results.places;
    const carriers = pollData.content.results.carriers;

    const simplified = Object.values(itineraries).map(itin => {
        const legId = itin.legIds[0];
        const leg = legs[legId];

        const origin = places[leg.originPlaceId];
        const destination = places[leg.destinationPlaceId];
        const airline = carriers[leg.marketingCarrierId];

        const priceObj = itin.pricingOptions[0].price;

        return {
            origin: origin?.iata || origin?.name,
            destination: destination?.iata || destination?.name,
            departureTime: leg.departureDateTime,
            arrivalTime: leg.arrivalDateTime,
            duration: leg.durationInMinutes,
            price: priceObj.amount / 1000,
            currency: pollData.content.displayProperties?.currency || 'GBP',
            deeplink: itin.pricingOptions[0].items[0].deepLink
        };
    });

    return simplified;
}

// --- GET /api/flights?from=LHR&to=EDI&year=2025&month=6&day=15 ---
router.get('/', async (req, res, next) => {
    const { from, to, year, month, day } = req.query;
    const apiKey = process.env.SKYSCANNER_API_KEY;

    if (!from || !to || !year || !month || !day) {
        return res.status(400).json({ error: 'Missing required query parameters.' });
    }

    try {
        // Step 1: POST to /create
        const createResponse = await axios.post(
            'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create',
            {
                query: {
                    market: "UK",
                    locale: "en-GB",
                    currency: "GBP",
                    queryLegs: [
                        {
                            originPlaceId: { iata: from },
                            destinationPlaceId: { iata: to },
                            date: {
                                year: parseInt(year),
                                month: parseInt(month),
                                day: parseInt(day)
                            }
                        }
                    ],
                    adults: 1,
                    childrenAges: [],
                    cabinClass: "CABIN_CLASS_ECONOMY",
                    excludedAgentsIds: [],
                    excludedCarriersIds: [],
                    includedAgentsIds: [],
                    includedCarriersIds: []
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                }
            }
        );

        const sessionToken = createResponse.data.sessionToken;

        // Step 2: Poll using the sessionToken
        const pollResponse = await axios.post(
            `https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/poll/${sessionToken}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                }
            }
        );

        const simplifiedFlights = simplifyFlightsFromPoll(pollResponse.data);
        res.status(200).json(simplifiedFlights);

    } catch (err) {
        console.error('Skyscanner API error:', err.message);
        next(err);
    }
});




module.exports = router;
