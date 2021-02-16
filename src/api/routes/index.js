const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => res.status(200).json({
    message: 'Welcome to Where To Stay API!',
}));

module.exports = router;
