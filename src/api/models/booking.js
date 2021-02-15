const mongoose = require('mongoose');
const { GuestSchema } = require('./guest');

const BookingSchema = new mongoose.Schema(
    {
        hotelId: {
            type: String,
            required: true,
        },
        guests: {
            type: [GuestSchema],
            required: true,
        },
        checkin: {
            type: Date,
            required: true,
        },
        checkout: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Bookings', BookingSchema);
