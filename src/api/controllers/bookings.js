const bookingsRepository = require('../repositories/bookings');

module.exports = {
    async list(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const size = parseInt(req.query.size, 10) || 20;
            const bookings = await bookingsRepository.list({ page, size });

            return res.status(200).json({
                total: bookings.total,
                page: bookings.currentPage,
                size: bookings.size,
                data: bookings.list,
            });
        } catch (ex) {
            return res.status(500).json({
                message: `Error listing bookings: ${ex.message}`,
            });
        }
    },
    async create(req, res) {
        try {
            const newBooking = await bookingsRepository.create(req.body);
            return res.status(201).json(newBooking);
        } catch (ex) {
            return res.status(500).json({
                message: `Error listing bookings: ${ex.message}`,
            });
        }
    },
};
