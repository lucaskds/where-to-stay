const { Router } = require('express');
const HotelsController = require('../controllers/hotels');

const router = Router();

router.get('/', HotelsController.validate('nearby'), HotelsController.nearby);

module.exports = router;
