const Bookings = require('../models/booking');

exports.list = async ({ page = 1, size = 20 }) => {
    const skip = (page - 1) * size;
    const bookingsCount = await Bookings.countDocuments();
    const bookings = await Bookings.find({}, 'hotelId guests checkin checkout', { skip, limit: size });
    const sanitizedBookings = bookings.map((booking) => ({
        hotelId: booking.hotelId,
        guests: booking.guests.map((guest) => ({
            name: guest.name,
            document: guest.document,
        })),
        checkin: booking.checkin,
        checkout: booking.checkout,
    }));

    return {
        total: bookingsCount,
        currentPage: page,
        size,
        list: sanitizedBookings,
    };
};

exports.create = async (data) => {
    const booking = await Bookings.create({
        hotelId: data.hotelId,
        guests: data.guests,
        checkin: new Date(data.checkin),
        checkout: new Date(data.checkout),
    });

    return {
        hotelId: booking.hotelId,
        guests: booking.guests.map((guest) => ({
            name: guest.name,
            document: guest.document,
        })),
        checkin: booking.checkin,
        checkout: booking.checkout,
    };
};
