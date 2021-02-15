const axios = require('axios');

const { HERE_API_KEY } = process.env;

exports.nearbyHotels = async ({ latlng, r }) => {
    if (!latlng || !r) throw new Error('Missing params!');

    const response = await axios.get(`https://discover.search.hereapi.com/v1/discover?apiKey=${HERE_API_KEY}&q=hotels&in=circle:${latlng};r=${r}`);
    const result = response.data && response.data.items;
    if (result && result.length) {
        return result.map((hotel) => {
            const {
                id, title, address, distance, position, access,
            } = hotel;

            return {
                id,
                title,
                address,
                distance,
                position,
                access,
            };
        });
    }
    return [];
};
