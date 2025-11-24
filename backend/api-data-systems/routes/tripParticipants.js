const express = require('express');
const router = express.Router();
const {
    createParticipant,
    getParticipantByTripId,
    deleteParticipant,
} = require('../controllers/tripParticipants.js');

router.post('/', createParticipant);
router.get('/:tripId', getParticipantByTripId);
router.delete('/:tripId/:userId', deleteParticipant);

module.exports = router;