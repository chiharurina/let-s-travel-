const express = require('express');
const router = express.Router();
const {
    getAllTrips,
    createTrip,
    getTripById,
    updateTrip,
    deleteTrip,
} = require('../controllers/trips');


router.get('/list', getAllTrips);
router.get('/list/:id', getTripById);
router.post('/create', createTrip);
router.put('/update/:id', updateTrip);
router.delete('/delete/:id', deleteTrip);

module.exports = router;