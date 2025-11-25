const pool = require('../database');

const getAllTrips = async (req, res) => {
    try{
        const fetch_query = 'SELECT * FROM trips';
        result = await pool.query(fetch_query)
        res.status(200).json(result.rows);
    } catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

const createTrip = async (req, res) => {
    try {
        const {id, destination, start_date, end_date} = req.body;
        const insert_query = 'INSERT INTO trips (id,destination,start_date,end_date) VALUES ($1,$2,$3,$4)';
        await pool.query(insert_query, [id,destination, start_date, end_date], (err) => {
            if (err){
                res.status(400).send(err);
            } else{
                res.status(200).send("Data Sent");
            }
        });
    } catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

const getTripById = async (req, res) => {
    try{
        const {id} = req.params;
        const fetch_query = 'SELECT * FROM trips WHERE id = $1';
        await pool.query(fetch_query, [id], (err, result) => {
            if (err){
                res.status(400).send(err);
            } else{
                if (result.rows.length < 1){
                    res.status(404).send(`No trips with id ${id}`);
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
    getAllTrips,
    createTrip,
    getTripById
}