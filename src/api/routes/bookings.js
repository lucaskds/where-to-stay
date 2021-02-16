const { Router } = require('express');
const BookingsController = require('../controllers/bookings');

const router = Router();

router.get('/', BookingsController.validate('list'), BookingsController.list);
router.post('/', BookingsController.validate('create'), BookingsController.create);

module.exports = router;
