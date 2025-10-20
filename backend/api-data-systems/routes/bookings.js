const express = require('express');
const router = express.Router();
const {
    createBooking,
    getBookingById
} = require('../controllers/bookings');

router.post('/', createBooking);
router.get('/:id', getBookingById);

module.exports = router;