const express = require('express');
const router = express.Router();
const {
    createParticipant,
    getParticipantByTripId
} = require('../controllers/tripParticipants.js');

router.post('/', createParticipant);
router.get('/:tripId', getParticipantByTripId);

module.exports = router;