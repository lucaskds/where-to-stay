const hereAPI = require('../../services/hereClient');

exports.nearby = async (req, res) => {
    try {
        const lat = req.query.lat.replace(',', '.');
        const lng = req.query.lng.replace(',', '.');
        const r = req.query.r > 5000 ? 5000 : req.query.r;
        const hotels = await hereAPI.nearbyHotels({ lat, lng, r });

        return res.status(200).json(hotels);
    } catch (ex) {
        return res.status(500).json({
            message: `Error getting nearby hotels: ${ex.message}`,
        });
    }
};
