const express = require('express');
const router = express.Router();
const {
    createItinerary,
    getItineraryById
} = require('../controllers/itinerary');

router.post('/', createItinerary);
router.get('/:id', getItineraryById);

module.exports = router;