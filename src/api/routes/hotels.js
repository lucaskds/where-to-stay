const HotelsController = require('../controllers/hotels');

module.exports = (router) => {
    router
        .get('/', HotelsController.validate('nearby'), HotelsController.nearby);
    return router;
};
