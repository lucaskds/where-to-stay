module.exports = (router) => {
    router
        .get('/', (req, res) => res.status(200).json({
            message: 'Welcome to Where To Stay API!',
        }));
    return router;
};
