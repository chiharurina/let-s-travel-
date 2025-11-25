const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weather');

router.get('/weather', getWeather);

module.exports = router;
