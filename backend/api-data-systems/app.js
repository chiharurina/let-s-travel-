const express = require('express');
const app = express();
const port = 8080;
const trips = require('./routes/trips');
const bookings = require('./routes/bookings');

app.use(express.json());

app.use('/trips', trips);
app.use('/bookings', bookings);

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log('Listening on port', port);
})