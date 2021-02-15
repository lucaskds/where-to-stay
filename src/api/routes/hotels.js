const HotelsController = require('../controllers/hotels');

module.exports = (router) => {
    router
        .get('/', HotelsController.nearby);
    return router;
};
