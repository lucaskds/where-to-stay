const BookingsController = require('../controllers/bookings');

module.exports = (router) => {
    router
        .get('/', BookingsController.list)
        .post('/', BookingsController.create);
    return router;
};
