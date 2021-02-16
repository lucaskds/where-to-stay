/* eslint-disable no-restricted-globals */
/* eslint-disable default-case */
const { query, body, validationResult } = require('express-validator');
const bookingsRepository = require('../repositories/bookings');

const {
    DEFAULT_SIZE_VALUE,
    MAX_SIZE_VALUE,
    MIN_SIZE_VALUE,
    DEFAULT_PAGE,
    MIN_PAGE_VALUE,
} = process.env;

// eslint-disable-next-line consistent-return
exports.validate = (method) => {
    const isDate = (date) => Date.parse(date);

    switch (method) {
    case 'list':
        return [
            query('size', 'size is missing').toInt().customSanitizer((value) => {
                if (isNaN(value)) return parseInt(DEFAULT_SIZE_VALUE, 10);
                if (value > 50) return parseInt(MAX_SIZE_VALUE, 10);
                if (value < 10) return parseInt(MIN_SIZE_VALUE, 10);
                return parseInt(value, 10);
            }),
            query('page', 'page is missing').toInt().customSanitizer((value) => {
                if (isNaN(value)) return parseInt(DEFAULT_PAGE, 10);
                if (value < MIN_PAGE_VALUE) return parseInt(MIN_PAGE_VALUE, 10);
                return parseInt(value, 10);
            }),
        ];
    case 'create':
        return [
            body('hotelId', 'hotelId is missing').exists(),
            body('guests', 'guest array is missing').custom((value) => value && value.length),
            body('checkin', 'checkin is missing').custom((value) => isDate(value)),
            body('checkout', 'checkout is missing').custom((value) => isDate(value)),
        ];
    }
};

exports.list = async (req, res) => {
    try {
        const { errors } = validationResult(req);
        if (errors && errors.length) {
            const invalidParams = errors.map((e) => e.param);
            throw new Error(`Invalid params: ${invalidParams.join(', ')}`);
        }
        const { page, size } = req.query;
        const bookings = await bookingsRepository.list({ page, size });

        return res.status(200).json({
            total: bookings.total,
            page: bookings.currentPage,
            size: bookings.size,
            data: bookings.list,
        });
    } catch (ex) {
        if (ex.message.includes('Invalid params')) {
            return res.status(400).json({
                message: ex.message,
            });
        }
        return res.status(500).json({
            message: `Error listing bookings: ${ex.message}`,
        });
    }
};

exports.create = async (req, res) => {
    try {
        const { errors } = validationResult(req);
        if (errors && errors.length) {
            const invalidKeys = errors.map((e) => e.param);
            throw new Error(`Invalid keys: ${invalidKeys.join(', ')}`);
        }
        const newBooking = await bookingsRepository.create(req.body);
        return res.status(201).json(newBooking);
    } catch (ex) {
        if (ex.message.includes('Invalid keys')) {
            return res.status(400).json({
                message: ex.message,
            });
        }
        return res.status(500).json({
            message: `Error creating booking: ${ex.message}`,
        });
    }
};
