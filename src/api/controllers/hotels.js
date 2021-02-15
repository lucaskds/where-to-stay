/* eslint-disable default-case */
const { query, validationResult } = require('express-validator');
const hereClient = require('../../services/hereClient');

exports.validate = (method) => {
    switch (method) {
    case 'nearby':
        return [
            query('lat', 'lat is missing').isNumeric(),
            query('lng', 'lng is missing').isNumeric(),
            query('r', 'r is missing').isNumeric().customSanitizer((value) => {
                if (value > 5000) return 5000;
                if (value < 100) return 100;
                return value;
            }),
        ];
    }
};

exports.nearby = async (req, res) => {
    try {
        const { errors } = validationResult(req);
        if (errors && errors.length) {
            const invalidParams = errors.map((e) => e.param);
            throw new Error(`Invalid params: ${invalidParams.join(', ')}`);
        }

        const { lat, lng, r } = req.query;
        const hotels = await hereClient.nearbyHotels({ lat, lng, r });

        return res.status(200).json(hotels);
    } catch (ex) {
        if (ex.message.includes('Invalid params')) {
            return res.status(400).json({
                message: ex.message,
            });
        }
        return res.status(500).json({
            message: `Error getting nearby hotels: ${ex.message}`,
        });
    }
};
