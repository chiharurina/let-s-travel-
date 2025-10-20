const pool = require('../database');

const createBooking = async (req, res) => {
    try{
        const {id, user_id, trip_id, status} = req.body;
        const insert_query = 'INSERT INTO bookings (id, user_id, trip_id, status) VALUES ($1,$2,$3,$4)'
        await pool.query(insert_query, [id,user_id,trip_id,status], (err, result) => {
            if (err){
                res.status(400).send(err);
            } else{
                res.status(200).send("Data Sent");
            }
        })
    } catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

const getBookingById = async (req, res) => {
    try{
        const {id} = req.params;
        const fetch_query = 'SELECT * FROM bookings WHERE id = $1';
        await pool.query(fetch_query, [id], (err, result) => {
            if (err){
                res.status(400).send(err);
            } else{
                if (result.rows.length < 1){
                    res.status(404).send(`No bookings with id ${id}`);
                } else{
                    res.status(200).json(result.rows);
                }
            }
        })
    } catch(err){
        console.error(err);
        res.sendStatus(500);
    }

}

module.exports = {
    createBooking,
    getBookingById
}