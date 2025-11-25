const {Pool} = require('pg');

//Enter in the actual database info here
const pool = new Pool({
    host: 'localhost',
    user: 'travel',
    port: '5000',
    password: 'Crazy_Travels',
    database: 'demoPost'
})

pool.connect().then(() => console.log('Connected SQL'))

module.exports = pool;