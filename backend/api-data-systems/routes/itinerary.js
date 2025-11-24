const express = require('express');
const router = express.Router();
const {
    createItinerary,
    getItineraryById,
    createItineraryItem,
} = require('../controllers/itinerary');

router.post('/', createItinerary);
router.get('/:id', getItineraryById);
router.post('/:id', createItineraryItem)

module.exports = router;