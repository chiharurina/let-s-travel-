const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const tripsRouter = require('./routes/trips');
const itineraryRouter = require('./routes/itinerary');
const participantsRouter = require('./routes/tripParticipants');
app.use('/api/trips', tripsRouter);
app.use('/api/itinerary', itineraryRouter);
app.use('/api/tripParticipants', participantsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));