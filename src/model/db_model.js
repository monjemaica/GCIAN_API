const mysql = require('mysql');
const dbconfig = require('../config/db_config');

const connection = mysql.createConnection({
    host: dbconfig.HOST,
    user: dbconfig.USER,
    password: dbconfig.PASSWORD,
    database: dbconfig.DB
});

connection.connect((err, res) => {
    if(err){
        throw err;
    }
    console.log('Successfully connected to the database');
})

module.exports = connection;