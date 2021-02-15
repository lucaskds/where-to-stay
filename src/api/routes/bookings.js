const BookingsController = require('../controllers/bookings');

module.exports = (router) => {
    router
        .get('/', BookingsController.validate('list'), BookingsController.list)
        .post('/', BookingsController.validate('create'), BookingsController.create);
    return router;
};
